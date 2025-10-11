import { createSession, getTags } from "../model.js";
import { renderHistory, ViewToHistory } from "./ui.js";

// const dispTags = async () => {
//   const tags = await getTags("what is happening");
//   console.log(tags);
// };

document.addEventListener("DOMContentLoaded", async () => {
  await createSession();
  const viewTabsBtn = document.getElementById("view-btn");
  viewTabsBtn.addEventListener("click", async () => {
    ViewToHistory();
    await renderHistory();
  });

  chrome.runtime.sendMessage(
    {
      header: {
        type: "session/process-activation",
      },
      status: "start",
    },
    (response) => {
      console.log("session: " + response.status);
      if (response.status === "process startup failed") {
      }
    }
  );
});
