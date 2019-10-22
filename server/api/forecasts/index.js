var _ = require('lodash');
var Q = require('q');
var express = require('express');
var router = express.Router();
var avalx = require('./avalx');
var moment = require('moment');
var request = require('request');
var logger = require('../../logger');
var config = require('../../config/environment');
var fs = require('fs');
var Prismic = require('prismic.io');

var webcache = require('./webcache');

var regions = require('../../data/season').forecast_regions;
var region_config = require('./region_config');

router.param('region', function(req, res, next) {
    req.region = _.find(regions.features, { id: req.params.region });

    // Bail out if there is no region with that ID
    if (!req.region) {
        logger.info(
            'forecast region not found url="' + req.originalUrl + '"'
        );
        return res.status(404).end('Not Found');
    }

    logger.debug('getting region:', req.params.region);
    getForecastData(req.params.region, req.region)
        .then(function(forecast) {
            req.forecast = forecast;
            return next();
        })
        .catch(function(e) {
            logger.error('loading region data:', e);
            res.send(500);
        })
        .done();
});

function getForecastData(regionName, region) {
    if (region.properties.type === 'link') {
        return Q.resolve({
            json: {
                id: region.id,
                name: region.properties.name,
                externalUrl: region.properties.url,
            },
        });
    } else if (region.properties.type === 'hotzone') {
        return Q.resolve(region.properties);
    }

    return webcache.avalxWebcache
        .get(region.id)
        .then(function(regionJson){
            return {
                region: region.id,
                // TODO: get the XML? Look at logs to see how much was coming out of it.
                //caaml: caaml,
                json: regionJson,
            };
        });
}

//! remove this route once we have updated the mobile app
router.get('/', function(req, res) {
    res.json(regions);
});

function isForecastRegion(r) {
    return (
        r.properties.type === 'parks' ||
        r.properties.type === 'avalx'
    );
}
function isLink(r) {
    return r.properties.type === 'link';
}
function isHotzone(r) {
    return r.properties.type === 'hotzone';
}

router.get('/ALL.json', function(req, res) {
    var fxPromises =
        _.chain(regions.features)
            .filter(isForecastRegion)
            .map(function(r) {
                var f = getForecastData(r.id, r);
                return f;
            })
            .value();
    Q.all(fxPromises).then(function(fxs){
        var fs = _.zipObject(
            _.map(fxs, function(f){ return f.json.region}),
            _.map(fxs, 'json')
        );
        res.status(200).json(fs);
    }).catch(function(err){
        logger.error("error retrieving forecases:",  err)
        res.status(500).json({err: "Error getting forecasts"});
    }).done();
});

router.get('/:region.:format', function(req, res) {
    req.params.format = req.params.format || 'json';
    var forecast;
    var locals;



    if (isHotzone(req.region) || isLink(req.region)) {
        return res.status(404).end('Region Not Found');
    }


    switch (req.params.format) {
        case 'xml':
            return res.status(404).text("XML is no longer supported. Please contact support@avalanche.ca if you require access to CAAML data");
            //TODO:
            //return res.type('application/xml').send(req.forecast.caaml);
            break;

        case 'json':
            return res.json(req.forecast.json);
            break;

        case 'rss':
            locals = avalx.getTableLocals(req.forecast.json);
            //TODO(wnh): Assert the failure mode for this hits the top level error handler
            return res.render('forecasts/forecast-rss', locals);
            break;

        case 'html':
            locals = avalx.getTableLocals(req.forecast.json);
            locals.AC_API_ROOT_URL = config.AC_API_ROOT_URL;
            res.render('forecasts/forecast-html', locals, function(err, html) {
                if (err) {
                    return res.status(500).end();
                } else {
                    return res.send(html);
                }
            });
            break;
        default:
            return res.status(404).end();
            break;
    }
});

router.get('/:region/nowcast.svg', function(req, res) {
    var styles;
    var mimeType = 'image/svg+xml';

    if (
        req.region.properties.type === 'parks' ||
        req.region.properties.type === 'avalx'
    ) {
        styles = avalx.getNowcastStyles(req.forecast.json);

        var cacheKey = 'nowcast-image::' + req.region.id;
        webcache.fragmentCache
            .wrap(cacheKey, function() {
                logger.debug('BUILDING Nowcast image...', cacheKey);
                return Q.nfcall(
                    res.render.bind(res),
                    'forecasts/nowcast',
                    styles
                );
            })
            .then(function(svg) {
                res.set('Cache-Control', 'no-cache');
                res.set('Content-Type', mimeType);
                res.send(svg);
            })
            .catch(function(err) {
                logger.error('generating nowcast svg:', err);
                res.send(500);
            });
        //.done();
    } else {
        res.send(404);
    }
});

router.get('/graphics/:type.svg', function(req, res) {
    var file = 'no_rating_icon.svg'

    switch (req.params.type.toLowerCase()) {
        case 'link':
            file = 'link_icon.svg'
            break;
        case 'spring':
            file = 'spring_situation_icon_map.svg'
            break;
        case 'off_season':
        case 'off-season':
            file = 'no_rating_icon.svg'
            break;
        case 'early_season':
        case 'early-season':
            file = 'early_season_icon.svg'
            break;
    }
    
    res.header('cache-control', 'no-cache');
    res.header('content-type', 'image/svg+xml');
    fs.createReadStream(config.ROOT + '/server/views/forecasts/' + file).pipe(res);
})

var DANGER_RATING_COLORS = {
    0: avalx.dangerColors.white,
    1: avalx.dangerColors.green,
    2: avalx.dangerColors.yellow,
    3: avalx.dangerColors.orange,
    4: avalx.dangerColors.red,
    5: avalx.dangerColors.black,
    n: avalx.dangerColors.white,
};
router.get('/graphics/:alp/:tln/:btl/danger-rating-icon.svg', function(
    req,
    res
) {
    var styles = {
        alp: DANGER_RATING_COLORS[req.params.alp],
        tln: DANGER_RATING_COLORS[req.params.tln],
        btl: DANGER_RATING_COLORS[req.params.btl],
    };

    res.render('forecasts/danger-icon', styles, function(err, svg) {
        if (err) {
            res.send(500);
        } else {
            res.header('Cache-Control', 'no-cache');
            res.header('Content-Type', 'image/svg+xml');
            res.send(svg);
        }
    });
});

router.get('/:region/danger-rating-icon.svg', function(req, res) {
    var ratingStyles = {
        alp: '',
        tln: '',
        btl: '',
    };

    var renderIcon = function(styles) {
        res.render('forecasts/danger-icon', styles, function(err, svg) {
            if (err) {
                res.send(500);
            } else {
                res.header('Cache-Control', 'no-cache');
                res.header('Content-Type', 'image/svg+xml');
                res.send(svg);
            }
        });
    };

    ratingStyles = avalx.getDangerIconStyles(req.forecast.json);

    // Render Empty for Links
    if (req.region.properties.type === 'link') {
        renderIcon({
            alp: '',
            tln: '',
            btl: '',
        });
        return;
    }
    // Every other Region will be 'avalx' or 'parks'

    logger.debug(req.forecast.region, req.forecast.json.dangerMode);
    // Early season, Regular season, Spring situation, Off season
    if (req.forecast.json.dangerMode === 'Regular season') {
        //renderIcon(ratingStyles);
        var cacheKey = 'danger-rating-icon::' + req.region.id;
        webcache.fragmentCache
            .wrap(cacheKey, function() {
                logger.debug('BUILDING danger-rating-icon...', cacheKey);
                return Q.nfcall(
                    res.render.bind(res),
                    'forecasts/danger-icon',
                    ratingStyles
                );
            })
            .then(function(svg) {
                res.header('Cache-Control', 'no-cache');
                res.header('Content-Type', 'image/svg+xml');
                res.send(svg);
            })
            .catch(function(err) {
                logger.error('rendering danger rating:', err);
                res.status(500).send(err);
            });
    } else if (req.forecast.json.dangerMode === 'Off season') {
        res.header('cache-control', 'no-cache');
        res.header('content-type', 'image/svg+xml');
        fs
            .createReadStream(
                config.ROOT + '/server/views/forecasts/no_rating_icon.svg'
            )
            .pipe(res);
    } else if (req.forecast.json.dangerMode === 'Early season') {
        res.header('cache-control', 'no-cache');
        res.header('content-type', 'image/svg+xml');
        fs
            .createReadStream(
                config.ROOT + '/server/views/forecasts/early_season_icon.svg'
            )
            .pipe(res);
    } else if (req.forecast.json.dangerMode === 'Spring situation') {
        res.header('cache-control', 'no-cache');
        res.header('content-type', 'image/svg+xml');
        fs
            .createReadStream(
                config.ROOT +
                    '/server/views/forecasts/spring_situation_icon_map.svg'
            )
            .pipe(res);
    } else {
        logger.error('unknown danger mode: ', req.forecast.json.dangerMode);
        res.send(500);
    }
});

function getDangerModes() {
    return webcache.fragmentCache.wrap('danger-modes', function() {
        logger.info('building danger-modes');
        /*
         * Use Q.Promise because the promise handleing in the Prismic library
         * wasnt working as expected
         */
        return Q.Promise(function(resolve, reject) {
            Prismic.api('https://avalancheca.prismic.io/api', function(
                err,
                api
            ) {
                if (err) {
                    reject(err);
                    return;
                }
                var dangerId = api.bookmarks['danger-modes'];

                api.getByID(dangerId, {}, function(err2, doc) {
                    if (err2) {
                        reject(err2);
                        return;
                    }
                    resolve(doc);
                });
            });
        }).then(function(doc) {
            var ids = _.map(regions.features, function(x) {
                return x.id;
            });
            var modes = {};
            var dangerModes = _.each(ids, function(id) {
                var value = doc.data['forecast-conditions.' + id];
                if (value) {
                    modes[id] = value.value;
                }
            });
            return modes;
        });
    });
}

module.exports = {
    router: router,
    getForecastData: getForecastData,
};
