var bg_col = getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color4');
var data_col = getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color2');

var width = document.getElementById('volume_map').clientWidth;
var height = document.getElementById('volume_map').clientHeight;

// Traffic Volume map
var volmap = d3.select('#volume_map').append('svg')
        .classed('NYC', true)
        .attr('width', width)
        .attr('height', height)
        .attr('margin-left', 0);

// Create a projection for NYC
d3.json('data/nyc_neighborhoods.geojson').then(function(data) {
var projection = d3.geoMercator()
    .scale(45000)
    .center([-73.94, 40.70])  // NYC coordinates
    .translate([width / 2, height / 2])

// Create a path generator
var path = d3.geoPath().projection(projection);

// Draw the map
volmap.selectAll('path')
    .data(data.features)
    .enter().append('path')
    .attr('d', path)
    .style('fill', bg_col)  // Customize the fill color
    .style('stroke', 'white');   // Customize the stroke color

d3.json('data/location_volume.json').then(function(traffic_volume) {
    volmap.selectAll("circle")
        .data(traffic_volume)
        .enter().append("circle")
        .classed('circle', true)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r",  d => d.volume/100000)  // Adjust the radius based on your preference
        .style("fill", data_col)  
        .style("opacity", 0.5)
    })
})


// Accident map
var a2018 = d3.select('#accidents2018').append('svg')
        .classed('NYC', true)
        .attr('width', width)
        .attr('height', height)
        .attr('margin-left', 0);

// Create a projection for NYC
d3.json('data/nyc_neighborhoods.geojson').then(function(data) {
var projection = d3.geoMercator()
    .scale(45000)
    .center([-73.94, 40.70])  // NYC coordinates
    .translate([width / 2, height / 2])

// Create a path generator
var path = d3.geoPath().projection(projection);

// Draw the map
a2018.selectAll('path')
    .data(data.features)
    .classed('map', true)
    .enter().append('path')
    .attr('d', path)
    .style('fill', bg_col)  // Customize the fill color
    .style('stroke', 'white');   // Customize the stroke color

d3.json('data/accidents2018.json').then(function(accidents) {
    a2018.selectAll("circle")
        .data(accidents)
        .enter().append("circle")
        .classed('circle', true)
        .attr("cx", d => projection([d.LONGITUDE, d.LATITUDE])[0])
        .attr("cy", d => projection([d.LONGITUDE, d.LATITUDE])[1])
        .attr("r",  d => d.accidents/20)  
        .style("fill", data_col)  
        .style("opacity", 0.5)
    })
})