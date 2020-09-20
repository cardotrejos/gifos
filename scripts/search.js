import api from './services.js';
import { CardsSearchResults } from './cards.js';
import { addEventOpenModal, addEventTouchModal } from './modal.js';
import { addEventFavButtonTrendingSearch } from './favorites.js';
import { api_key, divFavGridContainer, searchURL } from './global_variables.js';
import { addEventDownloadGif } from './download.js';


let allHTMLSearchGifs = '';

const viewMoreButton = document.getElementById('searchResults_button');

const searchGlobalParam = { api_key: undefined, divSearchResultsContainer: undefined };

const getSearchResultsGif = ((keyword, offset) => {
    allHTMLSearchGifs = '';
    const { searchData } = api;
    searchData(searchURL, api_key, keyword, 12, offset)
        .then((response) => {
            getSearchResultsJson(response.data, searchGlobalParam.divSearchResultsContainer);
            searchResultsPagination(response.pagination);
            setAttributeViewMore(keyword, (parseInt(offset) + 12));
        }).catch((error) => {
            renderMsg(error);
        });

});

const getSearchResultsJson = ((allgifs, divSearchResultsContainer) => {
    let innerHTMLResult = '';
    allgifs.forEach((everygif) => {
        innerHTMLResult = allSearchResultsCards(everygif);
    });
    divSearchResultsContainer.innerHTML += innerHTMLResult;
    addEventOpenModal(divSearchResultsContainer.querySelectorAll('.show-modal'));
    addEventFavButtonTrendingSearch(divSearchResultsContainer.querySelectorAll('.addFavorite'));
    addEventDownloadGif(divSearchResultsContainer.querySelectorAll('.downloadGifo'));
    addEventTouchModal(divSearchResultsContainer.querySelectorAll('.resultsCard__info'));
});

const allSearchResultsCards = ((onlyonegif) => {
    const { id, images, title, username } = onlyonegif;
    allHTMLSearchGifs += CardsSearchResults(id, images.fixed_height.url, title, username);
    return allHTMLSearchGifs;

});

const searchResultsPagination = ((resultsPagination) => {
    const { total_count, offset, count } = resultsPagination;
    let total_count_int = parseInt(total_count);
    let offset_int = parseInt(offset);
    let count_int = parseInt(count);

    if (total_count_int === 0) {
        hiddenViewMoreButton();
        showDivNoSearchResults();
    }
    else if (total_count_int == (offset_int + 1)) {
        hiddenViewMoreButton();
    }
    else if (total_count_int == count_int) {
        hiddenViewMoreButton();
    }

    else {
        showViewMoreButton();
    }

});

const showDivNoSearchResults = (() => {
    const showNoResults = document.getElementById('searchNoResults');
    showNoResults.classList.remove("search__noResultsHidden");
    showNoResults.classList.add("search__noResults");

});

const hideDivNoSearchResults = (() => {
    const hideNoResults = document.getElementById('searchNoResults');
    hideNoResults.classList.remove("search__noResults");
    hideNoResults.classList.add("search__noResultsHidden");


});

const hiddenViewMoreButton = (() => {
    viewMoreButton.classList.add("searchResults__button--hidden");

});

const showViewMoreButton = (() => {
    viewMoreButton.classList.remove("searchResults__button--hidden");

});


const cleaninputSearch = (() => {
    document.getElementById("search_form").reset();

});

let _listener = (() => {
    let keyword = viewMoreButton.getAttribute("data-keyword");
    let offset = viewMoreButton.getAttribute("data-offset");
    getSearchResultsGif(keyword, offset);
});


const addEventListenerViewMore = (() => {
    viewMoreButton.addEventListener("click", _listener, false);
});

const setAttributeViewMore = ((keyword, offset) => {
    viewMoreButton.setAttribute("data-keyword", keyword);
    viewMoreButton.setAttribute("data-offset", offset);

});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);

export { getSearchResultsGif, searchGlobalParam, addEventListenerViewMore, hideDivNoSearchResults, cleaninputSearch };