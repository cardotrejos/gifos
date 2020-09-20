import api from './services.js';
import {CardsTrending} from './cards.js';
import {addEventOpenModal, addEventTouchModal, addEventTouchTrendingModal} from './modal.js';
import {api_key, URLTrending} from './global_variables.js';
import {addEventFavButtonTrendingSearch} from './favorites.js';
import {addEventDownloadGif} from './download.js';


let allHTMLTrendingGifs = '';
let posInit = 0;

const before_slideshow = document.getElementById("slideshow__before");
const after_slideshow = document.getElementById("slideshow__after");

const getTrendingGif = ((divTrendingContainer) => {
    allHTMLTrendingGifs = '';
    const { trendingData } = api;
    trendingData(URLTrending, api_key, 15)
    .then((response) => {
        getTrendingJson(response.data, divTrendingContainer);
    }).catch((error) => {
      renderMsg(error);
    });
  });

 const getTrendingJson = ((allgifs, divTrendingContainer) => {
    allgifs.forEach((everygif) => {
        divTrendingContainer.innerHTML = allCards(everygif);        
    });
    addEventOpenModal(divTrendingContainer.querySelectorAll('.show-modal'));
    addEventFavButtonTrendingSearch(divTrendingContainer.querySelectorAll('.addFavorite'));
    addEventDownloadGif(divTrendingContainer.querySelectorAll('.downloadGifo'));
    EventTouchStart_Slideshow(divTrendingContainer.querySelectorAll('.card__info'));
    EventTouchEnd_Slideshow(divTrendingContainer.querySelectorAll('.card__info'), divTrendingContainer);

 });

const allCards = ((onlyonegif) => {
    const {id, images, title, username} = onlyonegif;
    allHTMLTrendingGifs += CardsTrending(id, images.fixed_height.url, title, username);
    return allHTMLTrendingGifs;

});

const EventListener_Slideshow = ((divElementContainerCards) => {
    after_slideshow.addEventListener("click", () => {
          divElementContainerCards.scrollLeft += 280;  
        }
    );

    before_slideshow.addEventListener("click", () => {
          divElementContainerCards.scrollLeft += -280;
        }
    );
});

const EventTouchStart_Slideshow = ((slideGifos) => {
    slideGifos.forEach((gifo) => {
        gifo.addEventListener("touchstart", (e) => {
            posInit = e.touches[0].clientX;
          });       
    });

});


const EventTouchEnd_Slideshow = ((slideGifos, divTrendingContainer) => {
    slideGifos.forEach((gifo) => {
        gifo.addEventListener("touchend", (e) => {
          let posEnd = e.changedTouches[0].clientX;
          if (posInit > posEnd + 5) {
            divTrendingContainer.scrollLeft += 208;  
          }
          else if (posInit < posEnd - 5) {
            divTrendingContainer.scrollLeft += -208;
          }
          else{
            addEventTouchTrendingModal(gifo);
          }
          });       
    });

});


const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg );

export {getTrendingGif, EventListener_Slideshow};