var width = 500,
    height = 500,
    centered;
    
// D3.js code to create the map will go here
var a2018 = d3.select('#accidents2018').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('margin-left', 0);

// Create a projection for NYC
d3.json('data/nyc_neighborhoods.geojson').then(function(data) {
var projection = d3.geoMercator()
    .scale(45000)
    .center([-73.94, 40.70])  // NYC coordinates
    .translate([width + width / 2, height + height / 2])

// Create a path generator
var path = d3.geoPath().projection(projection);

// Draw the map
a2018.selectAll('path')
    .data(data.features)
    .classed('map', true)
    .enter().append('path')
    .attr('d', path)
    .style('fill', 'red')  // Customize the fill color
    .style('stroke', 'white');   // Customize the stroke color
})