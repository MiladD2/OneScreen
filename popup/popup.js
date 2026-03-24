/**
 * Popup script to handle UI interactions and state.
 */

const captureBtn = document.getElementById("capture-btn");
const statusDiv = document.getElementById("status");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const mainUi = document.getElementById("main-ui");
const exportUi = document.getElementById("export-ui");
const savePngBtn = document.getElementById("save-png");
const savePdfBtn = document.getElementById("save-pdf");
const copyBtn = document.getElementById("copy-btn");
const resetBtn = document.getElementById("reset-btn");
const exportStatus = document.getElementById("export-status");

let capturedDataUrl = null;

captureBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) {
    statusDiv.textContent = "Error: No active tab found.";
    return;
  }

  // Start capture via Fireshot native listener
  captureBtn.disabled = true;
  statusDiv.textContent = "Starting Fireshot capture...";
  progressContainer.classList.add("hidden");

  // Trigger Fireshot capture flow natively by impersonating the public API event 
  try {
    chrome.runtime.sendMessage({ 
        message: "capturePageEvt", 
        Action: 0,       // 0 = Edit (Opens fsCaptured.html which acts as the post-process UI)
        Entire: "true",  // "true" = Entire page,
        Data: ""
    });
  } catch (e) {
    console.error("Capture trigger error:", e);
  }
  
  // Fireshot handles its own tabs/processing UI, so we can close immediately
  window.close();
});

// Listen for progress updates from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "capture-progress") {
    progressBar.style.width = message.progress + "%";
    statusDiv.textContent = `Capturing... ${message.progress}%`;
  }
});

function showExportUi() {
  mainUi.classList.add("hidden");
  exportUi.classList.remove("hidden");
  exportStatus.textContent = "Capture complete! Choose a format.";
}

function handleError(error) {
  captureBtn.disabled = false;
  statusDiv.textContent = "Error: " + error;
  progressContainer.classList.add("hidden");
}

savePngBtn.addEventListener("click", () => {
  if (!capturedDataUrl) return;
  chrome.downloads.download({
    url: capturedDataUrl,
    filename: `screenshot_${Date.now()}.png`
  });
  exportStatus.textContent = "PNG download started.";
});

savePdfBtn.addEventListener("click", async () => {
  if (!capturedDataUrl) return;
  exportStatus.textContent = "Generating PDF...";
  savePdfBtn.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({
      target: "offscreen",
      action: "export",
      format: "pdf",
      dataUrl: capturedDataUrl
    });

    if (response.status === "success") {
      chrome.downloads.download({
        url: response.pdfData,
        filename: `screenshot_${Date.now()}.pdf`
      });
      exportStatus.textContent = "PDF download started.";
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    exportStatus.textContent = "PDF failed: " + error.message;
  } finally {
    savePdfBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  if (!capturedDataUrl) return;
  exportStatus.textContent = "Copying to clipboard...";
  copyBtn.disabled = true;

  try {
    const response = await fetch(capturedDataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    exportStatus.textContent = "Copied to clipboard!";
  } catch (error) {
    console.error("Copy failed:", error);
    exportStatus.textContent = "Copy failed: " + error.message;
  } finally {
    copyBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", () => {
  capturedDataUrl = null;
  mainUi.classList.remove("hidden");
  exportUi.classList.add("hidden");
  captureBtn.disabled = false;
  statusDiv.textContent = "Ready to capture";
  progressBar.style.width = "0%";
  progressContainer.classList.add("hidden");
});
