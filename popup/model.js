export const initModel = async () => {
  const status = await LanguageModel.availability();
  if (status === "downloadable") {
    document.addEventListener("click", () => {
      if (!navigator.userActivation.isActive) {
        console.log("User activation not detected ");
        return;
      }

      console.log("User activation detected ");

      LanguageModel.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${(e.loaded * 100).toFixed(2)}%`);
          });
        },
      }).then((session) => {
        console.log("Model ready:", session);
      });
    });
  }
};

export const setTitle = async (longTitle) => {
  const status = await LanguageModel.availability();

  let session;
  if (status === "downloadable") {
    console.log(
      "Model needs to be downloaded. Wait for user activation to create session."
    );
    return;
  } else {
    session = await LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: `You are an AI assistant that shortens web page titles for display in a tab list. 
- Output should be concise (1-3 words). 
- Preserve main topic or keywords.
- Remove unnecessary words or branding.
- Output only the shortened title.`,
        },
      ],
    });
  }

  const response = await session.prompt(
    `Original tab title: "${longTitle}"\nProvide a short, display-friendly version:`
  );

  return response;
};
