import api from './services.js';
import { autocompleteURL } from './global_variables.js';


let allHTMLAutocompleteWords = '';

let autocompleteWordsContainer = document.getElementById('suggestedWords');

const inputSearch = document.getElementById('searchInput');


const getAutocompleteWord = ((api_key, keyword) => {
  allHTMLAutocompleteWords = '';
  const { autocompleteData } = api;
  autocompleteData(autocompleteURL, api_key, keyword)
    .then((response) => {
      getAutocompleteJson(response.data);
    }).catch((error) => {
      renderMsg(error);
    });
});


const getAutocompleteJson = ((allSuggestedWords) => {
  allSuggestedWords.forEach((everySuggestedWord) => {
    allHTMLAutocompleteWords += autocompleteWords(everySuggestedWord.name);
  });
  autocompleteWordsContainer.innerHTML = allHTMLAutocompleteWords;
  addEventSuggestedWord(autocompleteWordsContainer.querySelectorAll('.suggested-words__li'));
  autocompleteWordsContainer.classList.remove("hidden");

});

const addEventSuggestedWord = (suggested_words) => {
  suggested_words.forEach(suggested_word => {
    let keyword = suggested_word.getAttribute("data-keyword");
    suggested_word.addEventListener("click", () => {
      inputSearch.value = keyword;
      autocompleteWordsContainer.classList.add("hidden");
      toggleInactiveSearchStyles();
    }, false);

  });
}

const autocompleteWords = ((suggested_Word) => {
  return (
    `<li class="suggested-words__li" data-keyword="${suggested_Word}"><i class="icon-icon-search"></i>${suggested_Word}</li>`
  );
});

const toggleActiveSearchStyles = (() => {
  const showSearchIconLeft = document.getElementById('searchBtnLeft');
  const hideSearchIconRight = document.getElementById('searchBtn');
  const showCloseIconRight = document.getElementById('searchBtnClose');
  showSearchIconLeft.classList.remove("hidden");
  hideSearchIconRight.classList.add("hidden");
  showCloseIconRight.classList.remove("hidden");

});

const toggleInactiveSearchStyles = (() => {
  const hideSearchIconLeft = document.getElementById('searchBtnLeft');
  const showSearchIconRight = document.getElementById('searchBtn');
  const hideCloseIconRight = document.getElementById('searchBtnClose');
  hideSearchIconLeft.classList.add("hidden");
  showSearchIconRight.classList.remove("hidden");
  hideCloseIconRight.classList.add("hidden");

});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);

export { getAutocompleteWord, toggleActiveSearchStyles, toggleInactiveSearchStyles };