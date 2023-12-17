var width = 500,
    height = 500,
    centered;

// D3.js code to create the map will go here
var volmap = d3.select('#volume-map').append('svg')
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
    .style('fill', 'steelblue')  // Customize the fill color
    .style('stroke', 'white');   // Customize the stroke color

d3.json('data/location_volume.json').then(function(traffic_volume) {
   
    volmap.selectAll("circle")
        .data(traffic_volume)
        .enter().append("circle")
        .classed('circle', true)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r",  d => d.volume/100000)  // Adjust the radius based on your preference
        .style("fill", red)  // Use a color scale based on volume
        .style("opacity", 0.5)
    })
})

