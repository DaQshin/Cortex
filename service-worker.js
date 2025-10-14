import { setTitle, getTags } from "./model.js";

const updateStorage = async (tab) => {
  console.log(tab);
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

let activeTab;

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    activeTab = tabs[0];
  });

  await chrome.sidePanel.setOptions({
    tabId,
    path: "sidepanel/main.html",
    enabled: true,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    updateStorage(activeTab);
  } else if (message.pageContent && message.pageContent.length > 0) {
    getTags(message.pageContent)
      .then((tags) => {
        activeTab.tags = tags;
        console.log(tags);
        sendResponse({ success: true, tags });
      })
      .catch((error) => {
        console.error(error);
        sendResponse({ success: false, error: error.message });
      });
  }
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
