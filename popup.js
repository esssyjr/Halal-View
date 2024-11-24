document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.local.set({ enabled: true }, () => {
        console.log("Hala View enabled");
    });
});
