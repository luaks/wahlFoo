require('file?name=[name].[ext]!./index.html')
require('./style.css')
let d3 = require('d3');
let _ = require('lodash');
let data = require('./geoData.json');
let result = require('./resultData.json');
let colours = require('./colours.hjson')

let mapSvg = d3.select('#mapSvg');
let map = mapSvg.append('g');

let barSvg = d3.select('#barSvg');
let barChart = barSvg.append('g');

let horizontalScale = d3.scale.linear()
    .domain([16.18, 16.58])
    .range([0, 800]);

let verticalScale = d3.scale.linear()
    .domain([48.325, 48.055])
    .range([0, 800]);

let lineGenerator = d3.svg.line()
    .x(function (d) {
        return horizontalScale(d.x)
    })
    .y(function (d) {
        if(isNaN(verticalScale(d.y))) {
            debugger
        }
        return verticalScale(d.y)
    });

_.each(data, (datum)=> {
    datum.sprengel = _.filter(
        result,
        {
            bezirk: datum.district,
            sprengel: datum.subDistrict - 1000*datum.district
        }
    )[0];
});

function resetColours() {
    map.selectAll('path')
        .attr({
            fill: function(datum) {

                var sprengel = datum.sprengel;

                var candidate = maximumKey(sprengel.result);

                return colours[candidate];
            },
            'fill-opacity': 1
        });
}

function highlightCandidate(candidate) {
    map.selectAll('path')
        .attr({
            fill: function(datum) {
                return colours[candidate];
            },
            'fill-opacity': (datum)=> datum.sprengel.result[candidate] / _.sum(_.values(datum.sprengel.result))
        });
}

function updateData(data) {
    let mapData = map.selectAll('path').data(data);

    mapData.enter()
        .append('path')
        .attr({
            d: function(datum) {
                return lineGenerator(datum.coordinates) + "Z";
            }
        });

    mapData
        .attr({
            'data-bezirk': function(datum) {
                return datum.bezirk;
            },
            'data-sprengel': function(datum) {
                return datum.sprengel;
            }
        });

    mapData.exit()
        .remove();
}
updateData(data);
resetColours();

function maximumKey(target) {
    let currentMax, current;

    for(var key in target) {
        if(currentMax == undefined || target[key] >= currentMax) {
            current = key;
            currentMax = target[key];
        }
    }

    return current
}

let sumOfVotes = 0;
let absoluteResult = {};
let percentageResult = {};
let percentageResultData = [];
let barScale = d3.scale.linear()
        .domain([0, 40])
        .range([barSvg.attr('height'), 0])

_.each(result, (x)=> {
    for(var candidate in x.result) {
        if(absoluteResult[candidate] == undefined) {
            absoluteResult[candidate] = 0;
        }
        sumOfVotes += x.result[candidate];
        absoluteResult[candidate] = absoluteResult[candidate] + x.result[candidate];
    }
});

for(var candidate in absoluteResult) {
    percentageResult[candidate] = absoluteResult[candidate] / sumOfVotes;
    percentageResultData.push({candidate: candidate, percentage: (absoluteResult[candidate] / sumOfVotes)});
}

let barMargin = {
    left: 1,
    right: 1,
    width: 40
}

barChart.selectAll('rect.bar').data(percentageResultData)
    .enter()
    .append('rect')
    .attr({
        y: (d) => barScale(d.percentage * 100),
        x: (d, i) => i * barMargin.width + (1 + i) * barMargin.left + i * barMargin.right,
        width: barMargin.width,
        height: (d) => barSvg.attr('height') - barScale(d.percentage * 100),
        fill: (d) => colours[d.candidate]
    })
    .on('mouseover', function(d) {
        highlightCandidate(d.candidate);
    })
    .on('mouseout', function() {
        resetColours();
    });