/* global d3 */

var hArr = [61,68,79,68,67,82,52,89,74,68,73,50,58,81,82,50,60,57,76,79,70,79,
            84,89,70,51,52,90,90,59,58,82,74,57,60,50,89,63,88,67,59,88,79,51,
            58,85,73,74,54,69,53,68,63,78,68,50,61,82,59,79,67,78,77,61,64,71,
            53,51,84,71,64,52,89,51,57,86,50,74,75,64,71,86,59,83,51,63,77,83,
            79,77,65,66,55,88,67,80,80,70,79,53];

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var colors = d3.scale.linear()
            .range([height, 0])
            .range(['#ff0000', '#00ff00']);

var parseDate = d3.time.format('%m/%d/%Y').parse;


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var line = d3.svg.line()
    .x(function(d) {
        'use strict';
        return x(d.date);
    })
    .y(function(d) {
        'use strict';
        return y(d.close);
    });

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var curDate = new Date();

function nextDate () {
    'use strict';
    curDate.setDate(curDate.getDate() + 1);
    return curDate.toLocaleDateString();
}

var data = hArr.map(function(d) {
    'use strict';
    return {
        date: parseDate(nextDate()),
        close: d
    };

});

// console.log(data);


x.domain(d3.extent(data, function(d) {
    'use strict';
    return d.date;
}));
// y.domain(d3.extent(data, function(d) {
//     'use strict';
//     return d.close;
// }));
y.domain([
    d3.min(data, function(d) {
        'use strict';
        return d.close;
    }) * 0.95,
    d3.max(data, function(d) {
        'use strict';
        return d.close;
    }) * 1.05
]);

var area = d3.svg.area()
    .x(function(d) {
        'use strict';
        return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
        'use strict';
        return y(d.close);
    });

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Heart rate [bpm]');

svg.append("linearGradient")
        .attr("id", "area-gradient")                // change from line to area
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y(0))
        .attr("x2", 0).attr("y2", y(200))
    .selectAll("stop")
        .data([
            {offset: "0%", color: "red"},
            {offset: "10%", color: "blue"},
            {offset: "20%", color: "yellow"},
            {offset: "30%", color: "red"},
            {offset: "45%", color: "black"},
            {offset: "55%", color: "black"},
            {offset: "60%", color: "lawngreen"},
            {offset: "100%", color: "lawngreen"}
        ])
    .enter().append("stop")
        .attr("offset", function(d) {
            'use strict';
            return d.offset;
        })
        .attr("stop-color", function(d) {
            'use strict';
            return d.color;
        });

// svg.append('path')
//         .datum(data)
//         .attr('class', 'area')
//         .attr('d', area);

svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)
