let d3 = require('d3');
let _ = require('lodash');

let defaultOptions = {
    margins:{
        left: 1,
        right: 1,
        width: 40
    },
    noCandidateColour: '#DADADA'
}

module.exports = class BarChart {
    constructor (svg, colours, data, options) {
        this.container = svg.append('g');

        this.svg = svg;
        this.colours = colours;

        this.init(data, options)
    }

    init(data, options) {
        this.barScale = d3.scale.linear()
            .domain([0, 40])
            .range([this.svg.attr('height'), 0])

        this.options = _.extend({}, defaultOptions, options);
        let percentages = this.calculatePercentages(data);

        this.updateBarChartData(data);
    }

    calculatePercentages(result) {
        let sumOfVotes = 0;
        let absoluteResult = {};
        let percentageResult = {};
        let percentageResultData = [];

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

        percentageResultData.sort((a, b) => b.percentage - a.percentage);

        return percentageResultData;
    }

    updateBarChartData(data) {
        let percentages = this.calculatePercentages(data);

        this.barScale = d3.scale.linear()
            .domain([0, 10 * Math.ceil(10 * _.max(percentages.map((x)=>x.percentage)))])
            .range([this.svg.attr('height'), 0])

        let dataSelection = this.container.selectAll('rect')
            .data(percentages);

        let options = this.options;

        dataSelection
            .enter()
            .append('rect');

        dataSelection
            .exit()
            .remove();

        this.container.selectAll('rect')
            .attr({
                y: (d) => this.barScale(d.percentage * 100),
                x: (d, i) => i * this.options.margins.width + (1 + i) * this.options.margins.left + i * this.options.margins.right,
                width: this.options.margins.width,
                height: (d) => this.svg.attr('height') - this.barScale(d.percentage * 100)
            });

        this.resetColours();
    }

    highlightCandidate(candidate) {
        this.container.selectAll('rect')
            .attr('fill', (d) => d.candidate == candidate ? this.colours[d.candidate] : this.options.noCandidateColour);
    }

    resetColours() {
        this.container.selectAll('rect')
            .attr('fill', (d) => this.colours[d.candidate]);
    }

    on(eventName, handler) {
        this.container.selectAll('rect')
            .on(eventName, handler);
        
        return this;
    }

    off(handler) {
        this.container.selectAll('rect')
            .off(eventName, handler);
        
        return this;
    }
}