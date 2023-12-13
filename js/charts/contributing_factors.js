import {colors, readableIntegerString} from './constants.js';

(function () {
  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 0, bottom: 0, left: 0 },
    width = 850 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom,
    innerRadius = 50,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

  const bar_color = colors['bar_primary']

  // append the svg object
  const svg = d3.select("#contributing_factors")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`)

  d3.csv("/data/top_25_contributing_factors_percentage.csv").then(function (data) {

    // X scale: common for 2 data series
    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => d.FACTOR)) // The domain of the X axis is the list of states.
      .padding(0.05)

    // Y scale outer variable
    const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 1000000]) // Domain of Y is from 0 to the max seen in the data

    // ----------------
    // Create a tooltip
    // ----------------
    const Tooltip = d3.select("#contributing_factors")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function (event, d) {
      Tooltip.html("Percentage of accidents because of " + d.FACTOR + ": <b>" + d['PERCENTAGE'] + " </b>(" + readableIntegerString(d['COUNT']) + ")")
        .style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY) + "px");
    };

    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    // Add the bars
    svg.append("g")
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("fill", bar_color)
      .style("opacity", 0.8)
      .attr("class", "yo")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(d => y(d['COUNT']))
        .startAngle(d => x(d.FACTOR))
        .endAngle(d => x(d.FACTOR) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    // Add the labels
    svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("text-anchor", function (d) { return (x(d.FACTOR) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function (d) { return "rotate(" + ((x(d.FACTOR) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['COUNT']) + 1) + ",0)"; })
      .append("text")
      .text(d => d.FACTOR)
      .attr("transform", function (d) { return (x(d.FACTOR) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle")

  });

})();