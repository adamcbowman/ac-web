#!/usr/bin/env node

var fs = require('fs');
var _ = require('lodash');


var DATA      = process.argv[3], //__dirname + '/data/cac-data.json',
    CENTROIDS = process.argv[4], //__dirname + '/data/cac-polygons-centroids.geojson',
    POLY      = process.argv[5], //__dirname + '/data/cac-polygons.geojson';
    FORECASTS = process.argv[2]; //__dirname + '/data/cac-forecasts.json'


var data      = JSON.parse(fs.readFileSync(DATA)),
    centroids = JSON.parse(fs.readFileSync(CENTROIDS)),
    polygons  = JSON.parse(fs.readFileSync(POLY));

var forecasts = polygons.features.map(function (p) {

    var centroid = _.find(centroids.features, function(c) { 
      return c.properties.id === p.properties.id 
    });
    var fxData = _.find(data, { id: p.properties.id });

    p.id = fxData.id;
    _.extend(p.properties, fxData);
    p.properties.centroid = centroid.geometry.coordinates;

    delete p.properties.display;
    delete p.properties.id;
    delete p.properties.extId;

    return p;
});

polygons.features = forecasts;
console.log('Updated Region API data');
fs.writeFile(FORECASTS, JSON.stringify(polygons));


// was used to extract geojson props from api forecast.json file and write cac-data.json
// from now on we should not have to use this but adding to repo just in case.
// var data = fs.createReadStream(__dirname + '/data/forecast-regions.json');
// var regions = [];

// data
//     .pipe(JSONStream.parse('features.*'))
//     .on('data', function (data) {
//         var props = data.properties;

//         props.id = data.id;
//         props.extId = 0;
//         delete props.centroid;

//         regions.push(props);
//     })
//     .on('end', function () {
//         fs.writeFile(__dirname + '/data/cac-data.json', JSON.stringify(regions))
//     });
