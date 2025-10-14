(() => {
  const pageContent = document.body.innerText;
  console.log(pageContent.length);
  chrome.runtime.sendMessage(
    {
      pageContent,
    },
    (response) => {
      console.log(response);
    }
  );
})();
