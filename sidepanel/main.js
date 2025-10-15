import { renderHistory, ViewToHistory } from "./ui.js";
import { initSummarizer } from "../model/summarizer.js";

document.addEventListener("DOMContentLoaded", async () => {
  const response = await initSummarizer();
  console.log(response);
  const viewTabsBtn = document.getElementById("view-btn");
  viewTabsBtn.addEventListener("click", async () => {
    ViewToHistory();
    await renderHistory(response.session);
  });
});
