const apiKey = '9p3u62oTEKySNV81aH9qU6RPHCdI4Vn1';

let wordSearched = 'dog';

const urlTrending = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=4&rating=g`;

const urlSearch = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${wordSearched}&limit=12&offset=0&rating=g&lang=en`;


const createGifCard = () => {
  let divCard = document.createElement('div')
  let divIconDownload = document.createElement('div')
  let divIconFavorite = document.createElement('div')
  let divIconMaximize = document.createElement('div')
  let link = document.createElement('a')
  let img = document.createElement('img');
  img.src = url;
  divCard.className = "gif-card"
  divIconDownload.className = "icon-dowload"
  divIconFavorite.className = "icon-favorite"
  divIconMaximize.className = "icon-maximize"
  document.getElementById('searched-gifs').appendChild(divCard).appendChild(img);
  document.getElementById('searched-gifs').appendChild(divCard).appendChild(divIconDownload)
  document.getElementById('searched-gifs').appendChild(divCard).appendChild(divIconFavorite)
  document.getElementById('searched-gifs').appendChild(divCard).appendChild(divIconMaximize)
}


// VARIABLES
const searchInput = document.getElementById("search")
const sugContainer = document.getElementById("sug-container")

async function getSearchedGifs() {
  const response = await fetch(urlSearch);
  const data = await response.json();

  return data;
}

console.log(getSearchedGifs())

getSearchedGifs()
  .then(data => data.data.map(gif => gif.images.fixed_height.url)
    .forEach(url => {
        console.log(url)
    }) 
  );

async function getTrendingGifs() {
  const response = await fetch(urlTrending);
  const data = await response.json();

  return data;
};

getTrendingGifs()
  .then(data => data.data.map(gif => gif.images.fixed_height.url)
    .forEach(url => {
      let img = document.createElement('img');
      img.src = url;
      document.getElementById('img-container').appendChild(img);
    })
  );

// AUTOCOMPLETE || SUGGESTIONS

searchInput.addEventListener('keyup', printAutocomplete);

async function getAutocomplete() {
  const response = await fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${searchInput.value.trim()}`)
    .then(response => response.json())
    .then(content => content.data)
    .catch(err => {
      console.error(err);
    });
  return response
}

async function printAutocomplete() {
  sugContainer.innerHTML = "";
  const autoComplete = await getAutocomplete();
  let arr = autoComplete.slice(0, 5)
  arr.forEach(suggText => {
    sugContainer.innerHTML +=
      `
    <div id="suggested-search" class="suggested-search"><span>${suggText.name}</span></div>
    `
  })
}