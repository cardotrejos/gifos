import { changeTheme, verifyTheme } from './darkmode.js';
import api from './services.js';
import { api_key, uploadGifoURL, getGIFbyIDURL, downloadModal } from './global_variables.js';
import { addGifLocalStorage, getAllGifLocalStorage, existGifIDLocalStorage } from './new_gifo_localstorage.js';
import { addEventDownloadGifModal } from './download.js';

const newVideoInfoConteiner = document.getElementById('newVideoInfo');

const VideoTag = document.getElementById('videoTag');

const buttonStart = document.getElementById('buttonStart');
const buttonRecord = document.getElementById('buttonRecord');
const buttonFinish = document.getElementById('buttonFinish');
const buttonUpload = document.getElementById('buttonUpload');

const recordStep1 = document.getElementById('recordStep1');
const recordStep2 = document.getElementById('recordStep2');
const recordStep3 = document.getElementById('recordStep3');

const timer = document.getElementById('timer');
const repeatRecording = document.getElementById('repeatRecording');

const newGifoURL = document.getElementById('linkNewGifo');

const imageGif = document.getElementById('previewGif');


const showPreviewGifoHover = document.getElementById('previewGifoHover');
const showPreviewGifoButtons = document.getElementById('buttonsPreviewGifo');
const showGifoUploading = document.getElementById('gifoUploading');
const showGifoUploaded = document.getElementById('gifoUploaded');

let constraints = { audio: false, video: { width: 426, height: 240 } };
let startTime, IdInterval;
let recorder;
let form;
let streamCamera;


const init = (() => {
  const userMediaSupport = () =>
    !!(navigator.mediaDevices.getUserMedia)
  if (typeof MediaRecorder === "undefined" || !userMediaSupport())
    return alert("Tu navegador web no cumple los requisitos; por favor, utiliza Firefox o Google Chrome");

});

let getStreamAndRecord = (() => {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      hideDivNewVideoInfo();
      let video = VideoTag;
      streamCamera = mediaStream;
      video.srcObject = streamCamera;
      video.play();
    })
    .catch((error) => {
      renderMsg(error);
    });

});

let _startListener = (() => {
  changeDivNewVideoInfo();
  getStreamAndRecord();

});

let _recordListener = (() => {
  toogleStylesStartRecording();
  startCounting();
  recorder = RecordRTC(streamCamera, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: function () {
      console.log('Gif recording started.');
    }
  });

  recorder.startRecording();

  recorder.camera = streamCamera;

});


let _stopRecordingListener = (() => {
  toogleStylesStopRecording();
  stopCounting();

  VideoTag.srcObject = null;
  recorder.camera.stop();
  let blob = recorder.getBlob();
  imageGif.src = URL.createObjectURL(blob);
  VideoTag.classList.add("hidden");
  imageGif.classList.remove("hidden");
  recorder = null;

  form = new FormData();
  form.append('file', blob, 'myGif.gif');
  console.log(form.get('file'));

});

let _startRepeatCapture = (() => {
  changeDivNewVideoInfo();
  toogleStylesRepeatCapture();
  getStreamAndRecord();

});


const uploadGifo = (() => {
  const { uploadGifoData } = api;
  uploadGifoData(uploadGifoURL, api_key, form)
    .then((response) => {
      console.log(response.data.id);
      addGifLocalStorage(response.data.id);
      getGifByID(response.data.id);
      toogleStylesUploadedGifo();
    }).catch((error) => {
      renderMsg(error);
    });
});

const getGifByID = ((gifID) => {
  const { gifByIDData } = api;
  gifByIDData(getGIFbyIDURL, gifID, api_key)
    .then((response) => {
      newGifoURL.href = response.data.url;
      downloadModal.setAttribute("data-gif_url", response.data.images.original.url);
    }).catch((error) => {
      renderMsg(error);
    });
});


let _uploadGifoListener = (() => {
  toogleStylesUploadingGifo();
  uploadGifo();


});

const secondsToTime = ((numberOfSeconds) => {
  let hours = Math.floor(numberOfSeconds / 60 / 60);
  numberOfSeconds -= hours * 60 * 60;
  let minutes = Math.floor(numberOfSeconds / 60);
  numberOfSeconds -= minutes * 60;
  numberOfSeconds = parseInt(numberOfSeconds);
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (numberOfSeconds < 10) numberOfSeconds = "0" + numberOfSeconds;

  return `${hours}:${minutes}:${numberOfSeconds}`;
});

const refreshTimer = (() => {
  timer.textContent = secondsToTime((Date.now() - startTime) / 1000);
});


const startCounting = (() => {
  startTime = Date.now();
  IdInterval = setInterval(refreshTimer, 500);
});

const stopCounting = (() => {
  clearInterval(IdInterval);
  startTime = null;
  timer.textContent = "";
});


const addEventListenerButtonStart = (() => {
  buttonStart.addEventListener("click", _startListener, false);
});


const addEventListenerButtonRecord = (() => {
  buttonRecord.addEventListener("click", _recordListener, false);
});


const addEventListenerButtonStop = (() => {
  buttonFinish.addEventListener("click", (() => {
    recorder.stopRecording(_stopRecordingListener);

  }), false);

});


const addEventListenerRepeatRecording = (() => {
  repeatRecording.addEventListener("click", _startRepeatCapture, false);
});


const addEventListenerUploadGifo = (() => {
  buttonUpload.addEventListener("click", _uploadGifoListener, false);
});

const changeDivNewVideoInfo = (() => {
  console.log('llamado changeDivNewVideoInfo ');
  newVideoInfoConteiner.innerHTML = `<h3 class="record_video__h3" id="record_video__h3">¿Nos das acceso 
                                      <br /> a tu cámara?
                                      <p class="record_video__p" id="record_video__p">El acceso a tu camara será válido sólo
                                      <br />por el tiempo en el que estés creando el GIFO. </p>`;
  buttonStart.classList.remove("record__buttons");
  buttonStart.classList.add("hidden");
  recordStep1.classList.add("record_steps__hover");
});

const hideDivNewVideoInfo = (() => {
  newVideoInfoConteiner.classList.remove("newVideoInfo");
  newVideoInfoConteiner.classList.add("hidden");
  VideoTag.classList.remove("hidden");
  buttonRecord.classList.remove("hidden");
  recordStep1.classList.remove("record_steps__hover");
  recordStep2.classList.add("record_steps__hover");

});

const toogleStylesStartRecording = (() => {
  buttonRecord.classList.add("hidden");
  buttonFinish.classList.remove("hidden");
  repeatRecording.classList.add("hidden");
  timer.classList.remove("hidden");

});

const toogleStylesStopRecording = (() => {

  timer.classList.add("hidden");
  buttonFinish.classList.add("hidden");
  buttonUpload.classList.remove("hidden");
  repeatRecording.classList.remove("hidden");
  repeatRecording.classList.add("repeat_capture");


});

const toogleStylesRepeatCapture = (() => {
  recordStep2.classList.remove("record_steps__hover");
  imageGif.classList.add("hidden");
  buttonUpload.classList.add("hidden");
  repeatRecording.classList.add("hidden");
  newVideoInfoConteiner.classList.remove("hidden");
  newVideoInfoConteiner.innerHTML = `<h3 class="record_video__h3" id="record_video__h3">¿Nos das acceso 
                                      <br /> a tu cámara?
                                      <p class="record_video__p" id="record_video__p">El acceso a tu camara será válido sólo
                                      <br />por el tiempo en el que estés creando el GIFO. </p>`;
});

const toogleStylesUploadingGifo = (() => {
  recordStep2.classList.remove("record_steps__hover");
  recordStep3.classList.add("record_steps__hover");
  showPreviewGifoHover.classList.remove("hidden");
  showPreviewGifoHover.classList.add("preview_gifo__hover");
  showGifoUploading.classList.remove("hidden");
  showGifoUploading.classList.add("preview_gifo__uploading");
  repeatRecording.classList.add("hidden");
  buttonUpload.classList.add("hidden");

});

const toogleStylesUploadedGifo = (() => {
  showGifoUploading.classList.add("hidden");
  showGifoUploading.classList.remove("preview_gifo__uploading");

  showPreviewGifoButtons.classList.remove("hidden");
  showPreviewGifoButtons.classList.add("preview_gifo__buttons");

  showGifoUploaded.classList.remove("hidden");
  showGifoUploaded.classList.add("preview_gifo__uploading");



});

const renderMsg = ((msg) => document.querySelector('.gifos-msg').innerHTML = msg);



init();

addEventListenerButtonStart();
addEventListenerButtonRecord();
addEventListenerButtonStop();
addEventListenerRepeatRecording();
addEventListenerUploadGifo();
addEventDownloadGifModal(downloadModal);

verifyTheme();

changeTheme();


