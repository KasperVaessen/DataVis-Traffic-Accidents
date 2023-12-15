var width = 800;
var height = 600;

// D3.js code to create the map will go here
var svg = d3.select('#section2').append('svg')
        .attr('width', width)
        .attr('height', height);

// Create a projection for NYC
d3.json('data/nyc_neighborhoods.geojson').then(function(data) {
var projection = d3.geoMercator()
    .center([-73.94, 40.70])  // NYC coordinates
    .scale(70000)  // Adjust as needed

// Create a path generator
var path = d3.geoPath().projection(projection);

// Draw the map
svg.selectAll('path')
    .data(data.features)
    .classed('map', true)
    .enter().append('path')
    .attr('d', path)
    .style('fill', 'steelblue')  // Customize the fill color
    .style('stroke', 'white');   // Customize the stroke color

d3.json('data/location_volume.json').then(function(traffic_volume) {
    // Draw my data
    svg.selectAll("circle")
        .data(traffic_volume)
        .enter().append("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r",  d => d.volume/100000)  // Adjust the radius based on your preference
        .style("fill", d3.interpolateViridis)  // Use a color scale based on volume
        .style("opacity", 0.8);
    })
})