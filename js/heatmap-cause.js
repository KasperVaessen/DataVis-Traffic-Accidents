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
var svg = d3.select('#heatmap-cause-svg')
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
  .labelFormat(d3.format(".0%"))
  .scale(color);


var mapLayer = g.append('g')
  .classed('map-layer', true);

g.append('g')
.attr('class', 'legendLinear')
.attr('transform', 'translate(0,40)');

d3.json('../data/neighborhood_count_per_cause.json').then(function(crash_data) {
    var causes = Object.keys(crash_data['neighborhoods'][Object.keys(crash_data['neighborhoods'])[0]]).slice(0,8)
    causes.forEach((caus) => {
      d3.select('#cause')
          .append('option')
          .text(caus)
          .attr('value', caus); 
          console.log(caus);
  });
});


function change_cause() {
  var cause = document.getElementById("cause").value;
  d3.json('../data/nyc-neighborhoods.geojson').then(function(mapData) {
    render_non_normalized_cause(mapData, cause);
  });
}

document.getElementById("cause").onchange = function() {change_cause()};

d3.json('../data/nyc-neighborhoods.geojson').then(function(mapData) {
    // render_non_normalized(mapData);
    render_non_normalized_cause(mapData, 'Driver Inattention/Distraction');
});

function render_non_normalized_cause(mapData, cause) {
  d3.json('../data/neighborhood_count_per_cause.json').then(function(crash_data) {
    
      // Load map data
      // const vals = Object.values(crash_data)

      color.domain([Math.floor(crash_data.min_fraction/10)*10, Math.ceil(crash_data.max_fraction*10)/10]);
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
            mouseclick(d, crash_data, cause)
          })
      
      // Get province color
      function fillFn(d){
          return color(crash_data['neighborhoods'][idFn(d)][cause]);
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
var Tooltip = d3.select("#column_heatmap_cause")
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

var mouseclick = function(d, crash_data, cause) {
  var number = (crash_data['neighborhoods'][d.target.__data__.id][cause]*100).toString().slice(0, 5) + "%"
  Tooltip
    .html(d.target.__data__.properties.name + ": " + number)
  Tooltip
   .style("opacity", 1)
}