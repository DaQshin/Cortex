(() => {
  const extractText = () => {
    return document.body.innerText;
  };

  const text = extractText();

  chrome.runtime.sendMessage(
    {
      header: {
        type: "content/text",
        content_length: text.length,
      },
      content: text,
    },
    (response) => {
      console.log("message sent");
      console.log(response);
    }
  );
})();
