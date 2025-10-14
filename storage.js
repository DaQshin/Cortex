export const getHistories = async () => {
  const { histories = [] } = await chrome.storage.local.get(["histories"]);
  return histories;
};

export const clearHistories = async () => {
  await chrome.storage.local.clear();
  console.log("storage cleared.");
};

export const deleteHistory = async (url) => {
  const { histories = [] } = await chrome.storage.local.get("histories");
  const updated = histories.filter(
    (h) => new URL(h.tabURL).href !== new URL(url).href
  );
  await chrome.storage.local.set({ histories: updated });
};
