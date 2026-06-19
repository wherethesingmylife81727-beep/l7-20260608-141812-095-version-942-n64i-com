function setupMoviePlayer(videoId, layerId, sourceUrl) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    var hlsInstance = null;
    var isReady = false;

    if (!video || !layer || !sourceUrl) {
        return;
    }

    function attachSource() {
        if (isReady) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            isReady = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            isReady = true;
            return;
        }

        video.src = sourceUrl;
        isReady = true;
    }

    function playVideo() {
        attachSource();
        layer.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                layer.classList.remove("is-hidden");
            });
        }
    }

    layer.addEventListener("click", playVideo);
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener("play", function () {
        layer.classList.add("is-hidden");
    });
    video.addEventListener("ended", function () {
        layer.classList.remove("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
