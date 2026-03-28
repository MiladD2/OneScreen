/**
 * Popup script to handle UI interactions and state.
 */

const captureBtn = document.getElementById("capture-btn");
const statusDiv = document.getElementById("status");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");

captureBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) {
    statusDiv.textContent = "Error: No active tab found.";
    return;
  }

  // Start capture via OneScreen native listener
  captureBtn.disabled = true;
  statusDiv.textContent = "Starting OneScreen capture...";
  progressContainer.classList.add("hidden");

  try {
    const response = await chrome.runtime.sendMessage({ 
      message: "capturePageEvt", 
      Action: 0,
      Entire: "true",
      Data: "",
      tabId: tab.id
    });

    if (response && response.success === false) {
      throw new Error("Background rejected capture request");
    }

    // OneScreen handles its own tabs/processing UI, so we can close immediately.
    window.close();
  } catch (e) {
    captureBtn.disabled = false;
    statusDiv.textContent = "Capture failed. Open extension errors for details.";
    console.error("Capture trigger error:", e);
  }
});

// Listen for progress updates from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "capture-progress") {
    progressBar.style.width = message.progress + "%";
    statusDiv.textContent = `Capturing... ${message.progress}%`;
  }
});

chrome.storage.local.get("debugLogs", (res) => {
  const logsDiv = document.getElementById("debug-logs");
  if (logsDiv && res.debugLogs) {
    logsDiv.textContent = res.debugLogs.slice(-5).join("\n");
  }
});
