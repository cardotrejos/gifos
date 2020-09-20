async function downloadBlobAsFile(url) {
  let a = document.createElement('a');
  let response = await fetch(url);
  let file = await response.blob();
  a.download = 'myGif.gif';
  a.href = window.URL.createObjectURL(file);
  a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
  a.click();
}


const addEventDownloadGif = (buttonCards) => {
  buttonCards.forEach(buttonCard => {
    let gif_url = buttonCard.getAttribute("data-gif_url");
    buttonCard.addEventListener("click", () => {
      downloadBlobAsFile(gif_url);
    }, false);
  });
}

const addEventDownloadGifModal = (button) => {
  button.addEventListener("click", () => {
    let gif_url = button.getAttribute("data-gif_url");
    downloadBlobAsFile(gif_url);
  }, false);

}

export { addEventDownloadGif, addEventDownloadGifModal };