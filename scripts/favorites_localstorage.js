import { LOCAL_STORAGE_FAVORITE_GIFS } from './global_variables.js';

const addGifLocalStorage = ((selectedGif) => {
  let gifSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_GIFS)) || [];
  gifSelected.push(selectedGif);

  localStorage.setItem(LOCAL_STORAGE_FAVORITE_GIFS, JSON.stringify(gifSelected));
});

const removeGifLocalStorage = ((gif_id) => {
  let gifSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_GIFS)) || [];
  let index = gifSelected.indexOf(gif_id);
  gifSelected.splice(index, 1);

  localStorage.setItem(LOCAL_STORAGE_FAVORITE_GIFS, JSON.stringify(gifSelected));
});

const getAllGifLocalStorage = (() => {
  let gifSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_GIFS)) || [];
  return gifSelected.toString();

});

const existGifIDLocalStorage = ((gif_id) => {
  let IDList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_GIFS)) || [];
  let index = IDList.indexOf(gif_id);
  if (index >= 0) {
    return true;
  }
  else {
    return false;
  }
});

export { addGifLocalStorage, removeGifLocalStorage, getAllGifLocalStorage, existGifIDLocalStorage };