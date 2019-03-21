function Player () { // eslint-disable-line no-unused-vars
    var player = webapis.avplaystore.getPlayer();

    document.addEventListener('visibilitychange', function () {
        document.hidden ? player.suspend() : player.restore();
    });

    function init (url) {
        console.log('player open', url);
        player.open(url);
        player.setDisplayRect(480, 370, 960, 540);
        player.setListener({
            onbufferingstart: function () {
                console.log('Buffering start.');
            },
            onbufferingprogress: function (percent) {
                console.log('Buffering progress data : ' + percent);
            },
            onbufferingcomplete: function () {
                console.log('Buffering complete.');
            },
            onerror: function (eventType) {
                console.log('event type error : ' + eventType);
            }
        });
        player.setLooping(true);
    }

    function play () {
        player.prepareAsync(function () {
            player.play();
        });
    }

    function stop () {
        player.stop();
    }

    function getStatus () {
        return player.getState();
    }

    return {
        init: init,
        play: play,
        stop: stop,
        getStatus: getStatus
    };
}
