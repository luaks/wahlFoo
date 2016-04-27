let _ =require('lodash')

let defaultOptions = {};

module.exports = class Map {
    constructor(svg, colours, data, options) {
        this.svg = svg;
        this.container = svg.append('g');

        this.colours = colours;

        this.options = _.extend({}, defaultOptions, options);

        this.horizontalScale = d3.scale.linear()
            .domain([16.18, 16.58])
            .range([0, 800]);

        this.verticalScale = d3.scale.linear()
            .domain([48.325, 48.055])
            .range([0, 800]);

        this.lineGenerator = d3.svg.line()
            .x((d) => this.horizontalScale(d.x))
            .y((d) => this.verticalScale(d.y));
        
        this.updateData(data);
    }

    highlightCandidate(candidate) {
        this.container.selectAll('path')
            .attr({
                fill: (datum) => this.colours[candidate],
                'fill-opacity': (datum)=> datum.sprengel.result[candidate] / _.sum(_.values(datum.sprengel.result))
        });
    }

    resetColours() {
        this.container.selectAll('path')
            .attr({
                fill: (datum) => this.colours[this.maximumKey(datum.sprengel.result)],
                'fill-opacity': 1
            });
    }

    updateData(data) {
        let mapData = this.container.selectAll('path').data(data);

        mapData.enter()
            .append('path')
            .attr({
                d: (datum) => this.lineGenerator(datum.coordinates) + "Z"
            });

        mapData
            .attr({
                'data-bezirk': (datum) => datum.bezirk,
                'data-sprengel': (datum) => datum.sprengel
            });

        mapData.exit()
            .remove();
        
        this.resetColours();
    }

    maximumKey(target) {
        let currentMax, current;

        for(var key in target) {
            if(currentMax == undefined || target[key] >= currentMax) {
                current = key;
                currentMax = target[key];
            }
        }

        return current;
    }

    on(eventName, handler) {
        this.container.selectAll('path')
            .on(eventName, handler);

        return this;
    }

    off(handler) {
        this.container.selectAll('path')
            .off(eventName, handler);

        return this;
    }
};