let histories = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const tabTitle = tab.title;
    const tabURL = tab.url;
    const favIconURL = tab.favIconUrl;
    const newResult = { tabId, tabTitle, tabURL, favIconURL };
    histories = [...histories, newResult];
    chrome.storage.local
      .set({ histories })
      .then(() => console.log("Storage updated"));
  }
});
