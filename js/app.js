import Main from "./canvas/main.js";

let M = {
  music: null,
  currentMusicID: 1,

  init: function () {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.status == 200 && xhr.readyState == 4) {
        let data = JSON.parse(xhr.responseText);
        M.music = data;
        V.audio = new Audio(M.music[M.currentMusicID].link);
        V.audio.volume = 0.5;
        C.createVisualizer();
      }
    };

    xhr.open("get", "./js/music.json");
    xhr.send();
  },
};

let C = {
  init: function () {
    M.init();
    V.init();
  },

  setMusic: function (id) {
    M.currentMusicID = id;
    V.audio.src = M.music[id].link;
    C.togglePlay();
  },

  togglePlay: function () {
    V.context.resume();
    if (V.audio.paused) {
      V.audio.play();
      V.imageBtnPlay.src = "img/Pause.png";
    } else {
      V.audio.pause();
      V.imageBtnPlay.src = "img/Play.png";
    }
    V.musicTitle.textContent = M.music[M.currentMusicID].title;

    V.renderTime();
  },

  setTitle: function (id) {
    V.musicTitleHexa.textContent = M.music[id].title;
  },

  createVisualizer: function () {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    V.context = new AudioContext();

    let ctx = V.canvas.getContext("2d");

    V.canvas.width = window.innerWidth;
    V.canvas.height = window.innerHeight;

    if (V.src === undefined) {
      V.src = V.context.createMediaElementSource(V.audio);
    }

    let analyser = V.context.createAnalyser();
    V.src.connect(analyser);
    analyser.connect(V.context.destination);

    analyser.fftSize = 1024;

    let bufferLength = analyser.frequencyBinCount;

    let analyserDataArray = new Uint8Array(bufferLength);

    let main = new Main(V.canvas.width, V.canvas.height, analyserDataArray, bufferLength);

    function animationLoop() {
      ctx.clearRect(0, 0, V.canvas.width, V.canvas.height);
      analyser.getByteFrequencyData(analyserDataArray);

      ctx.globalCompositeOperation = "destination-over";

      main.update();
      main.draw(ctx);
      requestAnimationFrame(animationLoop);
    }

    requestAnimationFrame(animationLoop);
  },
};

let V = {
  hexagones: undefined,
  imageBtnPlay: undefined,
  barVolume: undefined,
  durationBar: undefined,
  musicTitle: undefined,
  textCurrentTime: undefined,
  textDuration: undefined,
  musicTitleHexa: undefined,

  arrow1: undefined,
  card: undefined,

  audio: undefined,
  context: undefined,
  src: undefined,
  canvas: undefined,
  init: function () {
    V.hexagones = document.querySelectorAll("g");
    V.imageBtnPlay = document.querySelector(".imageBtnPlay");
    V.barVolume = document.querySelector(".barVolume");
    V.durationBar = document.querySelector(".durationBar");
    V.musicTitle = document.querySelector(".musicTitle");
    V.textCurrentTime = document.querySelector(".currentTime");
    V.textDuration = document.querySelector(".duration");
    V.musicTitleHexa = document.querySelector(".musicTitleHexa");

    V.arrow = document.querySelectorAll(".arrow");
    V.card = document.querySelector(".card");

    V.canvas = document.querySelector("canvas");

    V.arrow.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        V.card.classList.toggle("is-flipped");
      });
    });

    for (let i = 1; i < V.hexagones.length; i++) {
      V.hexagones[i].addEventListener("click", () => {
        C.setMusic(i - 1);
      });

      V.hexagones[i].addEventListener("mouseenter", () => {
        C.setTitle(i - 1);
      });

      V.hexagones[i].addEventListener("mouseleave", () => {
        V.musicTitleHexa.textContent = "";
      });
    }

    V.imageBtnPlay.addEventListener("click", () => {
      C.togglePlay();
    });
    V.barVolume.addEventListener("input", () => {
      V.audio.volume = V.barVolume.value;
      V.renderTime();
    });
    V.durationBar.addEventListener("input", () => {
      V.audio.currentTime = V.durationBar.value;
      V.renderTime();
    });

    setInterval(() => {
      V.renderTime();
      V.durationBar.max = V.audio.duration;
    }, 1000);
  },

  renderTime: function () {
    V.durationBar.value = V.audio.currentTime;

    let CT = {
      minute: Math.floor(V.audio.currentTime / 60),
      seconde: Math.round(V.audio.currentTime % 60),
    };

    let D = {
      minute: Math.floor(V.audio.duration / 60),
      seconde: Math.round(V.audio.duration % 60),
    };

    if (CT.seconde < 10) CT.seconde = "0" + CT.seconde.toString();
    if (D.seconde < 10) D.seconde = "0" + D.seconde.toString();

    V.textCurrentTime.textContent = `${CT.minute}:${CT.seconde}`;
    V.textDuration.textContent = `${D.minute}:${D.seconde}`;
  },
};
C.init();
