import { setTitle } from "./model.js";

const updateStorage = async (tab) => {
  const tabId = tab.id;
  const tabTitle = await setTitle(tab.title, null);
  const tabURL = tab.url;
  const favIconURL = tab.favIconUrl;
  const newHistory = { tabId, tabTitle, tabURL, favIconURL };
  const { histories = [] } = await chrome.storage.local.get("histories");
  const exists = histories.some((el) => el.tabURL === tabURL);
  if (exists) return;
  const updatedHistories = [...histories, newHistory];
  await chrome.storage.local.set({ histories: updatedHistories });
  console.log("Storage updated");
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      updateStorage(activeTab);
    });
  }

  if (message.header?.type === "content/text") {
    sendResponse("hello");
  }
});
