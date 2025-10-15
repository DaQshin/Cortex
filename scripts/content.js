(() => {
  const pageContent = document.body.innerText;
  console.log("content.js: ", pageContent.length);
  chrome.runtime.sendMessage(
    {
      pageContent,
    },
    (response) => {
      console.log("recieved(content.js): ", response);
    }
  );
})();
