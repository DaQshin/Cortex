import { setTitle } from "./popup/model.js";

const updateStorage = async (tab) => {
  const tabId = tab.id;
  const tabTitle = await setTitle(tab.title);
  const tabURL = tab.url;
  const favIconURL = tab.favIconUrl;
  const newHistory = { tabId, tabTitle, tabURL, favIconURL };
  const { histories = [] } = await chrome.storage.local.get("histories");
  const updatedHistories = [...histories, newHistory];
  await chrome.storage.local
    .set({ histories: updatedHistories })
    .then(() => console.log("Storage updated"));
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      updateStorage(activeTab);
    });
  }
});
