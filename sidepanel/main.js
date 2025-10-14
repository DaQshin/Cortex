import { renderHistory, ViewToHistory } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const viewTabsBtn = document.getElementById("view-btn");
  viewTabsBtn.addEventListener("click", async () => {
    ViewToHistory();
    await renderHistory();
  });
});
