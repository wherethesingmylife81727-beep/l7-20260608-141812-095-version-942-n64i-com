(function () {
  var video = document.querySelector('[data-player]');

  if (!video) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var note = document.querySelector('[data-player-note]');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-action]'));
  var hls = null;

  function setText(value) {
    if (note) {
      note.textContent = value || '';
    }
  }

  function attachStream() {
    if (!stream) {
      setText('视频加载失败，请稍后重试。');
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(stream);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setText('视频加载失败，请稍后重试。');
            hls.destroy();
          }
        }
      });

      return;
    }

    setText('当前环境暂不支持播放。');
  }

  function playVideo() {
    if (!video.src && !hls) {
      attachStream();
    }

    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        setText('点击播放器开始播放。');
      });
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', playVideo);
  });

  video.addEventListener('play', function () {
    document.body.classList.add('is-playing');
    setText('');
  });

  video.addEventListener('pause', function () {
    document.body.classList.remove('is-playing');
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  attachStream();
})();
