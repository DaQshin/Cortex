export const getHistories = async () => {
  const { histories = [] } = await chrome.storage.local.get(["histories"]);
  return histories;
};

export const clearHistories = async () => {
  await chrome.storage.local.clear();
  console.log("storage cleared.");
};
