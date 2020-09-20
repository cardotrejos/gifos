import { getTrendingGif, EventListener_Slideshow } from './trending.js';
import { addEventCloseModal } from '../../../../../gifOS-master/scripts/modal.js';
import { changeTheme, verifyTheme } from './darkmode.js';
import { loadFavorites, addEventListenerFavViewMore } from './favorites.js';
import { addEventFavModal } from './favorites.js';
import { downloadModal } from './global_variables.js';
import { addEventDownloadGifModal } from './download.js';


const divElementContainerCards = document.querySelector('.slideshow__cards');


const closeButton = document.getElementById("close-button");


const _listenerCloseModal = (() => {
  loadFavorites(0);
})

const addEventListenerCloseModal = (() => {
  closeButton.addEventListener("click", _listenerCloseModal);
});


const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);


loadFavorites(0);

getTrendingGif(divElementContainerCards);

verifyTheme();

EventListener_Slideshow(divElementContainerCards);
addEventFavModal();
addEventCloseModal(closeButton);
addEventListenerCloseModal();
addEventListenerFavViewMore();
changeTheme();
addEventDownloadGifModal(downloadModal);



