import api from './services.js';
import { URLTrendingWords } from './global_variables.js';

let divTrendingWordsContainer = document.getElementById('trendingWordsContainer');
let allHTMLTrendingGifs = '';

const getTrendingWords = ((api_key) => {
  const { trendingWordsData } = api;
  trendingWordsData(URLTrendingWords, api_key).then((response) => { getTrendingWordsJson(response.data); }).catch((error) => { renderMsg(error); });
});

const getTrendingWordsPromise = ((api_key) => {
  return new Promise((resolve, reject) => {

    const { trendingWordsData } = api;

    trendingWordsData(URLTrendingWords, api_key)
      .then((response) => {
        getTrendingWordsJson(response.data);
      }).catch((error) => {
        renderMsg(error);
      }).then((response) => resolve(response)).catch((error) => reject(error));

  });
});


const getTrendingWordsJson = ((allTrendingWords) => {
  for (let i = 0; i < 5; i++) {
    allHTMLTrendingGifs += trendingWords(allTrendingWords[i]);
  }
  divTrendingWordsContainer.innerHTML = allHTMLTrendingGifs.slice(0, -2);

});

const trendingWords = ((data) => {
  return (
    `<span class="trending_words" id="trending_words">${data}</span>, `
  );
});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);

export { getTrendingWords, getTrendingWordsPromise };