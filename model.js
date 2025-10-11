let status;
let modelSession = null;
let params = null;
export const initModel = async () => {
  status = await LanguageModel.availability();
  if (status === "downloadable") {
    console.log("Model downloadable - waiting for user activation...");
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
        modelSession = session;
        console.log("model ready, session created.");
      });
    });
  } else {
    modelSession = await LanguageModel.create({
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
};

console.log("modelSession " + modelSession);

export const setTitle = async (longTitle) => {
  const quick = longTitle.split(/[-|-]/)[0].trim();

  if (!modelSession) {
    console.log("model not ready - using quick title...");
    return quick;
  }

  try {
    const response = await modelSession.prompt(
      `Original tab title: "${longTitle}"\nShortened:`
    );

    return response || quick;
  } catch (err) {
    console.error("Model prompt failed:", err);
    return quick;
  }
};

export const getTags = async (content) => {
  if (!modelSession) {
    console.log("model not ready - returning empty tags");
    return [];
  }
  const systemPrompt = `Generate 1-4 concise tags for this page content. Return only a comma-separated list.
Content: ${content}`;

  const response = await modelSession.prompt(systemPrompt);
  return response.split(",");
};
