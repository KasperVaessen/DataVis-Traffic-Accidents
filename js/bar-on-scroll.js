import { colors, readableIntegerString } from '/js/charts/constants.js';

var first_graph_color = colors['first_graph_color'];

d3.json('data/cause_per_year.json').then(function(data_year) { 
    // 1. Define a new scroller, and use the `.container` method to specify the desired container
    var scroll = scroller()
        .container(d3.select('#steps'));

    // 2. Pass in a selection of all elements that you wish to fire a step event:
    scroll(d3.selectAll('.step')); // each section with class `step` is a new step

    // Specify the function you wish to activate when a section becomes active
    scroll.on('active', function(index) {
        d3.selectAll('.step')
            .style('opacity', function (d, i) { return i === index ? 1 : 0.3; });
        update(index);
    })

 
 // set the dimensions and margins of the graph
 var margin = {top: 30, right: 30, bottom: 170, left: 120},
     width = 600 - margin.left - margin.right,
     height = 600 - margin.top - margin.bottom;
 
 // append the svg object to the body of the page
 var svg = d3.select("#cause_per_year")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");
 
    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(Object.keys(data_year['2013']))
    .padding(0.2);

    
    var axis = d3.axisBottom(x)
    // rotate x axis labels by 45 degrees
    

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(axis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("font-size", "15px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");


    
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, data_year['max']])
    .range([ height, 0]);
    svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));
    
    // A function that create / update the plot for a given variable:
    function update(index) {
        var year = String(2013+index);
        var data = data_year[year];
    
        var u = svg.selectAll("rect")
            .data(Object.keys(data))
        
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d); })
            .attr("y", function(d) { return y(data[d][0]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(data[d][0]); })
            .attr("fill", first_graph_color)
    }
    
    // Initialize the plot with the first dataset
    update(0)
})