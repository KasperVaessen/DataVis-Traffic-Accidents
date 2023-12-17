var width = 500,
        height = 500,
        centered;

// Define color scale
var first_graph_color = getComputedStyle(document.querySelector(':root')).getPropertyValue('--graph-color1');
var color = d3.scaleLinear([0, 500000], ['white', first_graph_color]);

var projection = d3.geoMercator()
    .scale(45000)
    // Center the Map in Colombia
    .center([-73.935242, 40.730610])
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

// Set svg width & height
var svg = d3.select('#heatmap-svg')
  .attr('width', width)
  .attr('height', height);

// Add background
svg.append('rect')
  .attr('fill', 'transparent')
  .attr('width', width)
  .attr('height', height)

var g = svg.append('g');

var legendLinear = d3.legendColor()
  .shapeWidth(width/20)
  .orient('vertical')
  .cells(6)
  .labelFormat(d3.format(".2s"))
  .scale(color);


var mapLayer = g.append('g')
  .classed('map-layer', true);

g.append('g')
.attr('class', 'legendLinear')
.attr('transform', 'translate(0,40)');


function change_year() {
  var year = document.getElementById("year").value;
  d3.json('../data/nyc-neighborhoods.geojson').then(function(mapData) {
    render_non_normalized_year(mapData, year);
  });
}
document.getElementById("year").onchange = function() {change_year()};
d3.json('../data/nyc-neighborhoods.geojson').then(function(mapData) {
    // render_non_normalized(mapData);
    render_non_normalized_year(mapData, 2013);
});

document.getElementById("select2018").onclick = function() {
  document.getElementById("year").value = 2018;
  change_year();
}

document.getElementById("select2013").onclick = function() {
  document.getElementById("year").value = 2013;
  change_year();
}

function render_non_normalized(mapData) {
    d3.json('../data/borough_count.json').then(function(crash_data) {
        // Load map data
        const vals = Object.values(crash_data)
        color.domain([d3.min(vals), d3.max(vals)]);
        g.select(".legendLinear").call(legendLinear);
        // console.log(min(crash_data))
        
        var features = mapData.features;

        // Update color scale domain based on data

        // Draw each province as a path
        mapLayer.selectAll('path')
            .data(features)
            .join('path')
            .attr('d', path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('stroke', 'gray')
            .style('fill', fillFn)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
        
        // Get province color
        function fillFn(d){
            return color(crash_data[nameFn(d)]);
        }
    });
}

function render_non_normalized_year(mapData, year) {
  d3.json('../data/neighborhood_count.json').then(function(crash_data) {
      // Load map data
      // const vals = Object.values(crash_data)

      color.domain([crash_data.min_accidents, crash_data.max_accidents]);
      g.select(".legendLinear").call(legendLinear);
      
      var features = mapData.features;

      // Update color scale domain based on data

      // Draw each province as a path
      mapLayer.selectAll('path')
          .data(features)
          .join('path')
          .attr('d', path)
          .attr('vector-effect', 'non-scaling-stroke')
          .style('stroke', 'gray')
          .style('fill', fillFn)
          .on('mouseover', mouseover)
          .on('mouseout', mouseout)
          .on('click', (d) => {
            mouseclick(d, crash_data, year)
          })
      
      // Get province color
      function fillFn(d){
          return color(crash_data['neighborhoods'][idFn(d)][year]);
      }
  });
}

function nameFn(d){
    return d && d.properties ? d.properties.name : null;
}

function idFn(d){
    return d && d.id ? d.id : null;
}

// create a tooltip
var Tooltip = d3.select("#column_heatmap")
  .append("div")
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  d3.select(this)
    .style("stroke", "black")

}
var mouseout = function(d) {
  d3.select(this)
    .style('stroke', 'gray')
}

var mouseclick = function(d, crash_data, year) {
  var number = crash_data['neighborhoods'][d.target.__data__.id][year]
  Tooltip
    .html(d.target.__data__.properties.name + ": " + number)
  Tooltip
   .style("opacity", 1)
}