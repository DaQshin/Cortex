import { getHistories, clearHistories, deleteHistory } from "../storage.js";
import { summarizer } from "../model/summarizer.js";
const backBtn = document.querySelector(".back-btn");
const saveTabBtn = document.getElementById("save-tab-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const filter = document.getElementById("filter");
const currentTabSummaryBtn = document.getElementsByClassName("summary-btn")[0];
// ==================== Button Handlers ====================

clearAllBtn.addEventListener("click", async () => {
  await clearHistories();
  await renderHistory();
});

saveTabBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "save" });
});

backBtn.addEventListener("click", () => {
  historyToView();
});

// ==================== Create History Element ====================
const createHistoryElement = (history) => {
  const historyTemplate = document.getElementById("history-item-template");
  const fragment = historyTemplate.content.cloneNode(true);

  const container = document.createElement("div");
  container.classList.add("history-item-container");
  container.dataset.url = history.tabURL;
  container.appendChild(fragment);

  const tabLogo = container.querySelector(".tab-logo");
  const tabTitle = container.querySelector(".tab-title");
  const delBtn = container.querySelector(".history-del-btn");
  const summarizeBtn = container.querySelector(".summary-btn");

  tabLogo.src = history.favIconURL || "../assets/fallback-logo.png";
  tabLogo.id = `${history.tabId}-tab-logo`;

  tabTitle.textContent = history.tabTitle;
  tabTitle.id = `${history.tabId}-tab-title`;

  if (tabTitle.tagName.toLowerCase() === "a") {
    tabTitle.href = history.tabURL;
  } else {
    tabTitle.addEventListener("click", () =>
      window.open(history.tabURL, "_blank")
    );
  }

  delBtn.addEventListener("click", async () => {
    const url = container.dataset.url;
    console.log("Deleting tab URL:", url);
    await deleteHistory(url);
    await renderHistory();
  });

  return container;
};

// ==================== Render History ====================
export const renderHistory = async (options = {}) => {
  const historyContainer = document.getElementById("history-container");
  const histories = await getHistories();

  historyContainer.innerHTML = "";

  if (!histories || histories.length === 0) {
    historyContainer.innerHTML = `
      <div class="fallback-ui">
        <h1>All clear. <br/>
        Ready to build something <span class="highlight">new.</span></h1>
      </div>
    `;
    clearAllBtn.style.display = "none";
    filter.style.display = "none";
    return;
  }

  clearAllBtn.style.display = "block";
  filter.style.display = "flex";

  histories.forEach((history) => {
    history.options = options;
    const el = createHistoryElement(history);
    historyContainer.appendChild(el);
  });
};

// ==================== View Switching ====================
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
