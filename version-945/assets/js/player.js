function initMoviePlayer(streamUrl) {
  var video = document.getElementById("movieVideo");
  var layer = document.getElementById("playLayer");
  var button = document.getElementById("playButton");
  var ready = false;

  if (!video) {
    return;
  }

  function attachStream() {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.hlsController = hls;
    } else {
      video.src = streamUrl;
    }

    ready = true;
  }

  function hideLayer() {
    if (layer) {
      layer.classList.add("is-hidden");
    }
  }

  function showLayer() {
    if (layer && video.paused) {
      layer.classList.remove("is-hidden");
    }
  }

  function startVideo() {
    attachStream();
    hideLayer();

    var playTask = video.play();

    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function () {
        showLayer();
      });
    }
  }

  if (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      startVideo();
    });
  }

  if (layer) {
    layer.addEventListener("click", startVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startVideo();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", hideLayer);
  video.addEventListener("pause", showLayer);
  video.addEventListener("ended", showLayer);
}
