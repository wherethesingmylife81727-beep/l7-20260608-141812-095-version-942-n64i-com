(function () {
  function initMoviePlayer(streamUrl) {
    var video = document.querySelector(".video-player");
    var cover = document.querySelector(".player-cover");
    var hls = null;
    var prepared = false;

    if (!video || !streamUrl) {
      return;
    }

    function playVideo() {
      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        return;
      }

      video.src = streamUrl;
      playVideo();
    }

    function start() {
      video.controls = true;
      hideCover();
      prepare();

      if (prepared && video.src) {
        playVideo();
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", hideCover);
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
