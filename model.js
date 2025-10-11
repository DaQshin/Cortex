let session = null;
export const checkAvailability = async () => {
  const availability = await LanguageModel.availability();
  return availability;
};

export const createSession = async (availability, params) => {
  try {
    const availability = await checkAvailability();
    if (availability === "downloadable") {
      session = await LanguageModel.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        },
      });
    } else if (!session) session = await LanguageModel.create(params);
  } catch (err) {
    console.log(err);
  }

  console.log(session);
};

export const setTitle = async (longTitle) => {
  const quick = longTitle.split(/[-|-]/)[0].trim();

  if (!session) {
    console.log("model not ready - using quick title...");
    return quick;
  }

  try {
    const response = await session.prompt(
      `Original tab title: "${longTitle}"\nShortened:`
    );

    return response || quick;
  } catch (err) {
    console.error("Model prompt failed:", err);
    return quick;
  }
};

export const getTags = async (content) => {
  if (!session) {
    console.log("model not ready - returning empty tags");
    return [];
  }
  try {
    const systemPrompt = `Generate 1-4 concise tags for this page content. Return only a comma-separated list.
Content: ${content}`;

    const response = await session.prompt(systemPrompt);
    return response.split(",").map((el) => el.trim());
  } catch (err) {
    console.log(err);
    return [];
  }
};
