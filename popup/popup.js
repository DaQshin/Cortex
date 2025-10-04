const createHistoryElement = (history) => {
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

const clearAllHistories = () => {
  const clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.clear(() => {
      console.log("storage cleared");
      renderHistory();
    });
  });
};

const renderHistory = () => {
  const historyContainer = document.getElementById("history-container");
  chrome.storage.local.get(["histories"], ({ histories }) => {
    historyContainer.innerHTML = "";
    if (histories.length > 0) {
      histories.forEach((history) => {
        const historyElement = createHistoryElement(history);
        historyContainer.appendChild(historyElement);
      });
    } else {
      const fallbackUI = doument.createElement("div");
      const img = document.createElement("img");
      img.src = "../assets/fallback-tab-logo";
      const p = document.createElement("p");
      p.textContent = "Tabs you search appear here.";
      fallbackUI.append(img, p);
      historyContainer.appendChild(fallbackUI);
    }
  });
};

renderHistory();
clearAllHistories();

chrome.storage.onChanged.addListener(() => {
  renderHistory();
});
