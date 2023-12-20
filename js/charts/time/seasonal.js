import { colors, readableIntegerString } from '../constants.js';

(function () {

  // set the dimensions and margins of the graph
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 650 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#seasonal")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Define color scale
  const color = d3.scaleOrdinal(colors['color_blind_friendly_4']);

  // Parse the Data
  d3.csv("/data/time/seasonal.csv").then(function (data) {

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d["Number Of Collisions"])])
      .range([2, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d["CRASH SEASON"]))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    // ----------------
    // Create a tooltip
    // ----------------
    const Tooltip = d3.select("#seasonal")
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
      Tooltip.html("Total crashes in " + d["CRASH SEASON"] + ": <b>" + d["Number Of Collisions"])
        .style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY) + "px");
    };

    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.9)
    }

    // Bars
    svg.selectAll("myRect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d["CRASH SEASON"]))
      .attr("width", 0) // Initial width set to 0
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d["CRASH SEASON"])) // Assign colors based on categories
      .attr("opacity", 0.9)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .transition() // Apply transition to bars
      .duration(1500)
      .delay((d, i) => i * 100) // Add delay per bar
      .attr("width", d => x(+d["Number Of Collisions"])); // Final width based on data

  })

})();
