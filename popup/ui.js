import { getHistories, clearHistories } from "./storage.js";
import { setTitle } from "./model.js";

const backBtn = document.querySelector(".back-btn");
const saveTabBtn = document.getElementById("save-tab-btn");
const clearAllBtn = document.getElementById("clear-all-btn");

export const ViewToHistory = () => {
  document.getElementById("view-div").style.display = "none";
  document.getElementById("tab-list-div").style.display = "block";
  document
    .querySelectorAll(".history-elements")
    .forEach((el) => (el.style.display = "block"));
};

export const historyToView = () => {
  document.getElementById("view-div").style.display = "block";
  document.getElementById("tab-list-div").style.display = "none";
  document
    .querySelectorAll(".history-elements")
    .forEach((el) => (el.style.display = "none"));
};

saveTabBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "save",
  });
});

backBtn.addEventListener("click", () => {
  historyToView();
});

const createHistoryElement = async (history) => {
  const historyTemplate = document.getElementById("history-item-template");
  const historyElement = historyTemplate.content.cloneNode(true);
  const tabLogo = historyElement.querySelector(".tab-logo");
  const tabTitle = historyElement.querySelector(".tab-title");
  if (!history.favIconURL) tabLogo.src = "../assets/fallback-logo.png";
  else tabLogo.src = history.favIconURL;

  console.log("logo : " + tabLogo.src);
  tabLogo.id = `${history.tabId}-tab-logo`;
  tabTitle.textContent = history.tabTitle;
  tabTitle.id = `${history.tabId}-tab-title`;
  tabTitle.href = history.tabURL;

  return historyElement;
};

export const renderHistory = async () => {
  const historyContainer = document.getElementById("history-container");
  const histories = await getHistories();
  historyContainer.innerHTML = "";
  if (histories.length === 0) {
    historyContainer.innerHTML = `
      <div class="fallback-ui">
        <h1>All clear. <br/>
        Ready to build something <span class="highlight">new.</span></h1>
      </div>
    `;
    clearAllBtn.style.display = "none";
    //<img src="../assets/fallback-tab-logo.png" />
    return;
  }
  clearAllBtn.style.display = "block";
  const elements = await Promise.all(histories.map(createHistoryElement));
  elements.forEach((el) => historyContainer.appendChild(el));
};

clearAllBtn.addEventListener("click", async () => {
  await clearHistories();
  await renderHistory();
  clearAllBtn.style.display = "none";
});
