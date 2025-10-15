export let summarizer = null;
const options = {
  sharedContext: "This is a scientific article",
  type: "key-points",
  format: "markdown",
  length: "medium",
  monitor(m) {
    m.addEventListener("downloadprogress", (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  },
};

export const checkSummarizerAvailability = async () => {
  const availability = await Summarizer.availability();
  return availability;
};

export const initSummarizer = async () => {
  const availability = await checkSummarizerAvailability();
  if (availability === "unavailable") {
    console.log("model(summarizer) unavailable");
  } else summarizer = await Summarizer.create(options);
  return {
    session: summarizer,
    availability,
  };
};
