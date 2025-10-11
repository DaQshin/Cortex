import { initModel } from "../model.js";
import { renderHistory, ViewToHistory } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initModel();
  const viewTabsBtn = document.getElementById("view-btn");
  viewTabsBtn.addEventListener("click", async () => {
    ViewToHistory();
    await renderHistory();
  });
});
