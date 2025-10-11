const text = document.body.innerText;

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
