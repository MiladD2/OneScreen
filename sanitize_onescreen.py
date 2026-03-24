import os
import re

# Paths to files
BASE_DIR = "/Users/milad/Creations/OneScreen"
FILES_TO_PROCESS = [
    os.path.join(BASE_DIR, "scripts/serviceWorker.js"),
    os.path.join(BASE_DIR, "scripts/captured.js"),
    os.path.join(BASE_DIR, "scripts/page/content.js"),
    os.path.join(BASE_DIR, "scripts/page/frames.js"),
    os.path.join(BASE_DIR, "manifest.json"),
    os.path.join(BASE_DIR, "captured.html"),
    os.path.join(BASE_DIR, "_locales/en/messages.json"),
    os.path.join(BASE_DIR, "popup/popup.js")
]

# Replacements
# format: (pattern, replacement, flags)
REPLACEMENTS = [
    # Branding
    (r"FireShot", "OneScreen", re.IGNORECASE),
    
    # Internal variables/keys (camelCase)
    (r"fsContentScriptId", "osContentScriptId", 0),
    (r"fsServiceWorker\.js", "serviceWorker.js", 0),
    (r"fsContent\.js", "content.js", 0),
    (r"fsCaptured\.js", "captured.js", 0),
    (r"fsCaptured\.html", "captured.html", 0),
    (r"fsHistory\.html", "about:blank", 0),
    (r"fsEnterLicense\.html", "about:blank", 0),
    (r"fsNativeInstall\.html", "about:blank", 0),
    (r"fsMigrateOptions\.html", "about:blank", 0),
    (r"fsGmailPermissions\.html", "about:blank", 0),
    (r"fsOptions\.html", "about:blank", 0),
    (r"fsCaptureList\.html", "about:blank", 0),
    (r"fsPermissions\.html", "about:blank", 0),
    (r"fsProgress\.html", "about:blank", 0),
    (r"fsPDFSettings\.html", "about:blank", 0),
    
    # Scripts to neuter
    (r"fsAutomationBanner\.js", "", 0),
    (r"fsautomationbanner\.css", "", 0),
    (r"fsActivation\.js", "", 0),
    (r"fsAPIEvents\.js", "", 0),

    # Internal Variables and Prefixes
    (r"fsDebug", "osDebug", 0),
    (r"fsAPI", "osAPI", 0),
    (r"fsCSID", "osCSID", 0),
    (r"fsFrameId", "osFrameId", 0),
    (r"fsSelectionLnkClose", "osSelectionLnkClose", 0),
    (r"fsOverflowRect", "osOverflowRect", 0),
    (r"fsRect", "osRect", 0),
    (r"FSSelectionHint", "OSSelectionHint", 0),
    (r"FSSelector", "OSSelector", 0),
    (r"X-FS-DATA", "X-OS-DATA", 0),
    (r"FSHASH", "OSHASH", 0),
    (r"ScreenShotAddon", "OneScreenAddon", 0),
    
    # Branding strings
    (r"ScreenShot", "OneScreen", 0),
    
    # Internal attribute names 
    (r"__screenshotIgnoredElement", "__onescreenIgnoredElement", 0),
    (r"__screenshotPosX", "__onescreenPosX", 0),
    (r"__screenshotPosY", "__onescreenPosY", 0),
    (r"__screenshotScrollX", "__onescreenScrollX", 0),
    (r"__screenshotScrollY", "__onescreenScrollY", 0),
    (r"__screenshotCheckedCntr", "__onescreenCheckedCntr", 0),
    (r"__screenshotSE", "__onescreenSE", 0),
    (r"__screenshotHiddenLink", "__onescreenHiddenLink", 0),
    (r"__screenshotLinkId", "__onescreenLinkId", 0),
    (r"__ScreenShotAutomationBanner", "__OneScreenAutomationBanner", 0),
    
    # Namespaces
    (r"ScreenShot\.topMessageHolder", "OneScreen.topMessageHolder", 0),
    
    # Filename references in code
    (r"fscaptured\.css", "captured.css", 0),
    (r"fsFrames\.js", "frames.js", 0),
    
    # External URLs
    (r"https?://(?:www\.)?getfireshot\.com", "https://mocknow.dev", re.IGNORECASE),
    (r"https?://(?:www\.)?screenshot-program\.com", "https://mocknow.dev", re.IGNORECASE),
    (r"https?://(?:www\.)?getscreenshot\.com", "https://mocknow.dev", re.IGNORECASE),
    (r"https?://ssl\.getscreenshot\.com", "https://mocknow.dev", re.IGNORECASE),
    (r"https?://auth\.getscreenshot\.com", "https://mocknow.dev", re.IGNORECASE),
]

def process_files():
    for file_path in FILES_TO_PROCESS:
        if not os.path.exists(file_path):
            print(f"Skipping missing file: {file_path}")
            continue
            
        print(f"Processing {file_path}...")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement, flags in REPLACEMENTS:
            content = re.sub(pattern, replacement, content, flags=flags)
        
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  Fixed {file_path}")
        else:
            print(f"  No changes needed for {file_path}")

if __name__ == "__main__":
    process_files()
