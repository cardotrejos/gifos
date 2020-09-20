import api from './services.js';
import { getTrendingGif, EventListener_Slideshow } from './trending.js';
import { addEventOpenModal, addEventCloseModal, addEventTouchModal } from './modal.js';
import { addEventFavButtonTrendingSearch } from './favorites.js';
import { changeTheme, verifyTheme } from './darkmode.js';
import { addEventFavModal } from './favorites.js';
import { CardsFavorites } from './cards.js';
import { api_key, getGIFbyIDURL, divMyGifosContainer, downloadModal } from './global_variables.js';
import { getAllGifLocalStorage } from './new_gifo_localstorage.js';
import { addEventDownloadGif, addEventDownloadGifModal } from './download.js';


let allHTMLMyGifosResults;
const maxGifsToShow = 12;

const divElementContainerCards = document.querySelector('.slideshow__cards');

const noGifos = document.getElementById('myGifosNoContent');
const viewMoreButton = document.getElementById('myGifosViewMoreButton');


const closeButton = document.getElementById("close-button");


const loadMyGifos = ((offset) => {
    let ids = getAllGifLocalStorage();
    if (ids.length > 0) {
        getGIFSbyID(ids.split(","), offset);
    }
    else {
        showDivNoGifos();
    }
});


const getGIFSbyID = ((ids, offset) => {
    allHTMLMyGifosResults = '';
    let myGifosIDS = [];
    let topOffset = 0;
    const { gifsByIDData } = api;

    if ((offset + maxGifsToShow) < ids.length) {
        topOffset = offset + maxGifsToShow;
    }
    else {
        topOffset = ids.length;
    }

    for (let i = offset; i < topOffset; i++) {
        myGifosIDS.push(ids[i]);
    }

    gifsByIDData(getGIFbyIDURL, api_key, myGifosIDS)
        .then((response) => {
            getGIFbyIDJson(response.data);
            myGifosPagination(ids.length, topOffset);
            setAttributeViewMore(offset + maxGifsToShow);

        }).catch((error) => {
            renderMsg(error);
        });
});


const getGIFbyIDJson = ((allMyGifs) => {
    let innerHTMLResult = '';
    allMyGifs.forEach((everyGifo) => {
        innerHTMLResult = allFavoriteCards(everyGifo);
    });
    divMyGifosContainer.innerHTML += innerHTMLResult;
    addEventOpenModal(divMyGifosContainer.querySelectorAll('.show-modal'));
    addEventFavButtonTrendingSearch(divMyGifosContainer.querySelectorAll('.addFavorite'));
    addEventDownloadGif(divMyGifosContainer.querySelectorAll('.downloadGifo'));
    addEventTouchModal(divMyGifosContainer.querySelectorAll('.resultsCard__info'));

});

const allFavoriteCards = ((onlyOneFavGif) => {
    const { id, images, title, username } = onlyOneFavGif;
    allHTMLMyGifosResults += CardsFavorites(id, images.fixed_height.url, title, username);
    return allHTMLMyGifosResults;

});


let _myGifosListener = (() => {
    let offset = viewMoreButton.getAttribute("data-offset");
    loadMyGifos(offset);
});


const addEventListenerMyGifosViewMore = (() => {
    viewMoreButton.addEventListener("click", _myGifosListener, false);
});



const myGifosPagination = ((total_count, topOffset) => {
    if (total_count === 0) {
        hiddenMyGifosViewMoreButton();
        showDivNoGifos();

    }
    else if (total_count === topOffset) {
        hiddenMyGifosViewMoreButton();
        hideDivNoGifos();

    }
    else {
        showMyGifosViewMoreButton();
    }

});

const setAttributeViewMore = ((offset) => {
    viewMoreButton.setAttribute("data-offset", offset);

});

const hiddenMyGifosViewMoreButton = (() => {
    viewMoreButton.classList.remove("myGifosResults__button");
    viewMoreButton.classList.add("hidden");

});


const showMyGifosViewMoreButton = (() => {
    viewMoreButton.classList.remove("hidden");
    viewMoreButton.classList.add("myGifosResults__button");


});


const showDivNoGifos = (() => {

    noGifos.classList.remove("hidden");
    noGifos.classList.add("myGifosNoContent");
    divMyGifosContainer.innerHTML = '';
    viewMoreButton.classList.add("hidden");

});

const hideDivNoGifos = (() => {
    noGifos.classList.remove("myGifosNoContent");
    noGifos.classList.add("hidden");
});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);


loadMyGifos(0);
getTrendingGif(divElementContainerCards);

verifyTheme();

EventListener_Slideshow(divElementContainerCards);
addEventFavModal();
addEventCloseModal(closeButton);
changeTheme();
addEventListenerMyGifosViewMore();
addEventDownloadGifModal(downloadModal);


