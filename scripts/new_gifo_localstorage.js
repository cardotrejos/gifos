import { LOCAL_STORAGE_MY_GIFOS } from './global_variables.js';

const addGifLocalStorage = ((selectedGif) => {
    let gifSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_GIFOS)) || [];
    gifSelected.push(selectedGif);

    localStorage.setItem(LOCAL_STORAGE_MY_GIFOS, JSON.stringify(gifSelected));
});


const getAllGifLocalStorage = (() => {
    let gifSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_GIFOS)) || [];
    return gifSelected.toString();

});

const existGifIDLocalStorage = ((gif_id) => {
    let IDList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_GIFOS)) || [];
    let index = IDList.indexOf(gif_id);
    if (index >= 0) {
        return true;
    }
    else {
        return false;
    }
});


export { addGifLocalStorage, getAllGifLocalStorage, existGifIDLocalStorage };