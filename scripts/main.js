import { getTrendingGif, EventListener_Slideshow } from './trending.js';
import { addEventCloseModal } from './modal.js';
import { changeTheme, verifyTheme } from './darkmode.js';
import { addEventFavModal } from './favorites.js';
import { getSearchResultsGif, searchGlobalParam, addEventListenerViewMore, hideDivNoSearchResults, cleaninputSearch } from './search.js';
import { getTrendingWords, getTrendingWordsPromise } from './trending_words.js';
import { getAutocompleteWord, toggleActiveSearchStyles, toggleInactiveSearchStyles } from './autocomplete.js';
import { addEventDownloadGifModal } from './download.js';
import { downloadModal } from './global_variables.js';


const api_key = '9p3u62oTEKySNV81aH9qU6RPHCdI4Vn1';

const divElementContainerCards = document.querySelector('.slideshow__cards');
const divSearchResultsContainer = document.querySelector('.resultsGrid');


const closeButton = document.getElementById("close-button");


const btnSearch = document.getElementById('searchBtn');
const inputSearch = document.getElementById('searchInput');

const trendingWordClick = document.getElementById('searchBtn');
let autocompleteWordsContainer = document.getElementById('suggestedWords');


let _listenerSearch = (() => {
    hideDivNoSearchResults();
    cleanDivSearchResultsContainer();
    let keyword = inputSearch.value;
    document.getElementById('keywordSearch').innerHTML = keyword;
    getSearchResultsGif(keyword, 0);
    showDivSearchResults();
});



const _listenerTrendingWords = (() => {
    let trendingWords = trendingWordsContainer.querySelectorAll('.trending_words');
    trendingWords.forEach(trendingWord => {
        trendingWord.addEventListener("click", () => {
            hideDivNoSearchResults();
            cleanDivSearchResultsContainer();
            let keyword = trendingWord.innerHTML;
            inputSearch.value = keyword;
            document.getElementById('keywordSearch').innerHTML = keyword;
            getSearchResultsGif(keyword, 0);
            showDivSearchResults();
        }, false);

    });
});


const getTrendingWordsAwait = (() => {
    getTrendingWordsPromise(api_key)
        .then(() => {
            _listenerTrendingWords();
        }).catch((error) => {
            renderMsg(error);
        });
});


const cleanDivSearchResultsContainer = (() => {
    document.getElementById("resultsGrid").innerHTML = "";

});

const cleansuggestedWordsUL = (() => {
    document.getElementById("suggestedWords").innerHTML = "";

});

const showDivSearchResults = (() => {
    const showResults = document.getElementById('searchResults');
    showResults.classList.remove("searchResultsHidden");
    showResults.classList.add("searchResults");

});


const showDivNoSearchResults = (() => {
    const showNoResults = document.getElementById('searchNoResults');
    showNoResults.classList.remove("search__noResultsHidden");
    showNoResults.classList.add("search__noResults");

});

const setSearchGlobalParam = (() => {
    searchGlobalParam.api_key = api_key;
    searchGlobalParam.divSearchResultsContainer = divSearchResultsContainer;

});

const addEventListenerAutocomplete = (() => {
    inputSearch.addEventListener('input', function (e) {
        if (e.keyCode !== 13) {
            cleansuggestedWordsUL();
            getAutocompleteWord(api_key, inputSearch.value);
            toggleActiveSearchStyles();
            addEventListenerCloseAutocomplete();
        }
    })
    autocompleteWordsContainer.addEventListener("click", () => {
        _listenerSearch();
    })
});

const addEventListenerCloseAutocomplete = (() => {
    const closeIcon = document.getElementById('searchBtnClose');
    closeIcon.addEventListener('click', function (e) {
        const autocompleteWordsContainer = document.getElementById('suggestedWords');
        autocompleteWordsContainer.classList.add("hidden");
        cleansuggestedWordsUL();
        toggleInactiveSearchStyles();

    });
});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);

cleaninputSearch();
cleanDivSearchResultsContainer();

verifyTheme();

getTrendingGif(divElementContainerCards);
getTrendingWordsAwait();

setSearchGlobalParam();

EventListener_Slideshow(divElementContainerCards);
addEventFavModal();
addEventCloseModal(closeButton);
addEventListenerViewMore();
addEventListenerAutocomplete();
changeTheme();
addEventDownloadGifModal(downloadModal);

export { getSearchResultsGif, searchGlobalParam };