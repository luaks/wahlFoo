require('file?name=[name].[ext]!./index.html')
require('./style.css')
let BarChart = require('./BarChart.js');
let Map = require('./Map.js')

let d3 = require('d3');
let _ = require('lodash');
let data = require('./geoData.json');
let result = require('./resultData.json');
let colours = require('./colours.hjson')

let mapSvg = d3.select('#mapSvg');
let barSvg = d3.select('#barSvg');

_.each(data, (datum)=> {
    datum.sprengel = _.filter(
        result,
        {
            bezirk: datum.district,
            sprengel: datum.subDistrict - 1000*datum.district
        }
    )[0];
});

var barChart = new BarChart(barSvg, colours, result);
var map = new Map(mapSvg, colours, data);

map.on('mouseover', (d) => barChart.updateBarChartData([d.sprengel]));
map.on('mouseout', (d) => barChart.updateBarChartData(result));

barChart.on('mouseover', (d) => map.highlightCandidate(d.candidate));
barChart.on('mouseout', () => map.resetColours());
