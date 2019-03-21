var models = (function () { // eslint-disable-line no-unused-vars
    var markets = {
        EU: 'EUROPE'
    };

    function getSize () {
        return webapis.productinfo.getRealModel().slice(2, 4);
    }

    function getMarket () {
        return markets[webapis.productinfo.getLocalSet().split('_')[0]];
    }
    function getYear () {
        return 20 + webapis.productinfo.getModelCode().split('_')[0];
    }

    function getSeries () {
        return webapis.productinfo.getRealModel().slice(4, 6);
    }

    return {
        QE75Q6FNA: {
            size: 75,
            market: 'EUROPE',
            year: 2018,
            series: 'Q6',
            trailer: 'videos/QE75Q6FNA.mp4'
        },
        getCurrent: function () {
            return {
                size: getSize(),
                market: getMarket(),
                year: getYear(),
                series: getSeries()
            };
        }
    };
}());
