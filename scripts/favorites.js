import api from './services.js';
import { CardsFavorites } from './cards.js';
import { addEventOpenModal, addEventTouchModal } from './modal.js';
import { api_key, getGIFbyIDURL, divFavGridContainer, favModal } from './global_variables.js';
import { addGifLocalStorage, removeGifLocalStorage, getAllGifLocalStorage, existGifIDLocalStorage } from './favorites_localstorage.js';
import { addEventDownloadGif } from './download.js';

let allHTMLFavResults;
const favViewMoreButton = document.getElementById('favResultsButton');
const maxGifsToShow = 12;



const loadFavorites = ((offset) => {

  if (divFavGridContainer) {
    if (offset === 0)
      cleanDivFavsContainer();

    let ids = getAllGifLocalStorage();
    if (ids.length > 0) {
      getGIFSbyID(ids.split(","), offset);
    }
    else {
      showDivNoFavResults();
    }
  }

});

const getGIFSbyID = ((ids, offset) => {
  allHTMLFavResults = '';
  let favIDS = [];
  let topOffset = 0;
  const { gifsByIDData } = api;

  if ((offset + maxGifsToShow) < ids.length) {
    topOffset = offset + maxGifsToShow;
  }
  else {
    topOffset = ids.length;
  }

  for (let i = offset; i < topOffset; i++) {
    favIDS.push(ids[i]);
  }

  gifsByIDData(getGIFbyIDURL, api_key, favIDS)
    .then((response) => {
      getGIFbyIDJson(response.data);
      favoritesPagination(ids.length, topOffset);
      setAttributeViewMore(offset + maxGifsToShow);

    }).catch((error) => {
      renderMsg(error);
    });
});

const getGIFbyIDJson = ((allFavoritesGifs) => {
  let innerHTMLResult = '';
  allFavoritesGifs.forEach((everyFavoriteGif) => {
    innerHTMLResult = allFavoriteCards(everyFavoriteGif);
  });
  divFavGridContainer.innerHTML += innerHTMLResult;
  addEventOpenModal(divFavGridContainer.querySelectorAll('.show-modal'));
  addEventFavButton(divFavGridContainer.querySelectorAll('.addFavorite'));
  addEventDownloadGif(divFavGridContainer.querySelectorAll('.downloadGifo'));
  addEventTouchModal(divFavGridContainer.querySelectorAll('.resultsCard__info'));

});


const allFavoriteCards = ((onlyOneFavGif) => {
  const { id, images, title, username } = onlyOneFavGif;
  allHTMLFavResults += CardsFavorites(id, images.fixed_height.url, title, username);
  return allHTMLFavResults;

});

const favoritesPagination = ((total_count, topOffset) => {
  if (total_count === 0) {
    hiddenFavViewMoreButton();
    showDivNoFavResults();

  }
  else if (total_count === topOffset) {
    hiddenFavViewMoreButton();
    hideDivNoFavResults();

  }
  else {
    showFavViewMoreButton();
  }

});

const setAttributeViewMore = ((offset) => {
  favViewMoreButton.setAttribute("data-offset", offset);

});



const hiddenFavViewMoreButton = (() => {
  favViewMoreButton.classList.remove("favResults__button");
  favViewMoreButton.classList.add("hidden");

});

const showFavViewMoreButton = (() => {
  favViewMoreButton.classList.remove("hidden");
  favViewMoreButton.classList.add("favResults__button");


});

const showDivNoFavResults = (() => {
  const showNoFavs = document.getElementById('favNoContent');
  showNoFavs.classList.remove("hidden");
  showNoFavs.classList.add("search__noResults--h3");
  divFavGridContainer.innerHTML = '';
  favViewMoreButton.classList.add("hidden");

});


const hideDivNoFavResults = (() => {
  const hideNoFavs = document.getElementById('favNoContent');
  hideNoFavs.classList.remove("search__noResults--h3");
  hideNoFavs.classList.add("hidden");


});

const cleanDivFavsContainer = (() => {
  divFavGridContainer.innerHTML = "";

});

const addEventFavButton = ((favoriteGifs) => {
  favoriteGifs.forEach(favoriteGif => {
    let gif_id = favoriteGif.getAttribute("data-gif_favIDS");
    refreshFavButton(gif_id);

    favoriteGif.addEventListener("click", () => {
      if (existGifIDLocalStorage(gif_id)) {
        removeGifLocalStorage(gif_id);
        toogleFavButtonInactive(gif_id);
      }
      else {
        addGifLocalStorage(gif_id);
        toogleFavButtonActive(gif_id);
      }
      loadFavorites(0);
    }, false);
  });
});

const addEventFavButtonTrendingSearch = ((favoriteGifs) => {
  favoriteGifs.forEach(favoriteGif => {
    let gif_id = favoriteGif.getAttribute("data-gif_favIDS");
    refreshFavButton(gif_id);

    favoriteGif.addEventListener("click", () => {
      if (existGifIDLocalStorage(gif_id)) {
        removeGifLocalStorage(gif_id);
        toogleFavButtonInactive(gif_id);
      }
      else {
        addGifLocalStorage(gif_id);
        toogleFavButtonActive(gif_id);
      }
      loadFavorites(0);
    }, false);
  });
});

const addEventFavModal = (() => {

  favModal.addEventListener("click", () => {
    let gif_id = favModal.getAttribute("data-gif_favIDS");
    if (existGifIDLocalStorage(gif_id)) {
      removeGifLocalStorage(gif_id);
      toogleFavButtonInactive(gif_id);
    }
    else {
      addGifLocalStorage(gif_id);
      toogleFavButtonActive(gif_id);
    }
  }, false);
});

let _favListener = (() => {
  let offset = favViewMoreButton.getAttribute("data-offset");
  loadFavorites(offset);
});

const addEventListenerFavViewMore = (() => {
  favViewMoreButton.addEventListener("click", _favListener, false);
});


const refreshFavButton = ((gif_id) => {
  if (existGifIDLocalStorage(gif_id)) {
    toogleFavButtonActive(gif_id);
  }
  else {
    toogleFavButtonInactive(gif_id);
  }
})

const toogleFavButtonActive = ((gif_id) => {
  const favButtonON = document.querySelectorAll("[data-gif_favIDS='" + gif_id + "']");
  favButtonON.forEach((everyFavButton) => {
    everyFavButton.innerHTML = `<span class="icon-icon-fav-active" id="favButton-active"></span>`;
  })

});


const toogleFavButtonInactive = ((gif_id) => {
  const favButtonOFF = document.querySelectorAll("[data-gif_favIDS='" + gif_id + "']");
  favButtonOFF.forEach((everyFavButton) => {
    everyFavButton.innerHTML = `<span class="icon-icon-fav-hover" id="favButton-inactive"></span>`;
  })
});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);

export { loadFavorites, addEventFavButton, addEventFavButtonTrendingSearch, addEventListenerFavViewMore, addEventFavModal, refreshFavButton };