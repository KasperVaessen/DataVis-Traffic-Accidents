import { colors, readableIntegerString } from '../constants.js';

(function () {
  // set the dimensions and margins of the graph
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  const color = d3.scaleOrdinal(colors['color_blind_friendly_4']);

  // append the svg object to the body of the page
  const svg = d3.select("#monthly")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.csv("/data/time/monthly.csv").then(function (data) {

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d["CRASH MONTH"]))
      .padding(0.2);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 200000])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // ----------------
    // Create a tooltip
    // ----------------
    const Tooltip = d3.select("#monthly")
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

      const month = d["CRASH MONTH"];
      const index = seasons.findIndex(season => {
        switch (season) {
          case "Winter":
            return ["Dec", "Jan", "Feb"].includes(month);
          case "Spring":
            return ["Mar", "Apr", "May"].includes(month);
          case "Summer":
            return ["Jun", "Jul", "Aug"].includes(month);
          case "Authumn":
            return ["Sep", "Oct", "Nov"].includes(month);
        }
      });

    }

    // Create a month name map from short name to full name
    const monthMap = {
      "Jan": "January",
      "Feb": "February",
      "Mar": "March",
      "Apr": "April",
      "May": "May",
      "Jun": "June",
      "Jul": "July",
      "Aug": "August",
      "Sep": "September",
      "Oct": "October",
      "Nov": "November",
      "Dec": "December"
    }

    // create a function that maps each season to a color in the color palette
    function colorMap(season) {
      switch (season) {
        case "Sep":
        case "Oct":
        case "Nov":
          return colors['color_blind_friendly_4'][0];
        case "Mar":
        case "Apr":
        case "May":
          return colors['color_blind_friendly_4'][1];
        case "Jun":
        case "Jul":
        case "Aug":
          return colors['color_blind_friendly_4'][2];
        case "Dec":
        case "Jan":
        case "Feb":
          return colors['color_blind_friendly_4'][3];
      }
    }


    var mousemove = function (event, d) {
      Tooltip.html("Total crashes on " + monthMap[d["CRASH MONTH"]] + ": <b>" + d["Number Of Collisions"])
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

    // Bars
    svg.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", d => x(d["CRASH MONTH"]))
      .attr("y", height) // Initial y position at the bottom of the chart
      .attr("width", x.bandwidth())
      .attr("height", 0) // Initial height set to 0
      .attr("fill", d => colorMap(d["CRASH MONTH"]))
      .attr("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .transition() // Apply transition to bars
      .duration(1500)
      .delay((d, i) => i * 100) // Add delay per bar
      .attr("y", d => y(d["Number Of Collisions"])) // Final y position
      .attr("height", d => height - y(d["Number Of Collisions"])); // Final height



    // Append a group for the legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 120}, -20)`)
      .attr("class", "legend")
      .style("cursor", "pointer");


    // Create an array of seasons for the legend
    const seasons = ["Authumn", "Spring", "Summer", "Winter"];

    // Add colored rectangles for each season
    const legendRects = legend.selectAll(".legendRect")
      .data(seasons)
      .enter().append("circle")
      .attr("cx", 10)
      .attr("cy", (d, i) => i * 20 + 4)
      .attr("r", 7)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => colors['color_blind_friendly_4'][i])
      .style("opacity", 0.8)


    // Add text labels for each season
    const legendText = legend.selectAll(".legendText")
      .data(seasons)
      .enter().append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 9)
      .text(d => d);

    // Highlight bars on legend hover
    legend.selectAll("circle, text")
      .on("mouseover", function (event, d) {
        const index = seasons.indexOf(d);
        svg.selectAll("rect")
          .filter(data => {
            const month = data["CRASH MONTH"];
            switch (index) {
              case 0:
                return ["Sep", "Oct", "Nov"].includes(month);
              case 1:
                return ["Mar", "Apr", "May"].includes(month);
              case 2:
                return ["Jun", "Jul", "Aug"].includes(month);
              case 3:
                return ["Dec", "Jan", "Feb"].includes(month);
            }
          })
          .style("opacity", 1)
          .style("stroke", "black");
      })
      .on("mouseout", function () {
        svg.selectAll("rect")
          .style("opacity", 0.8)
          .style("stroke", "none");
      });
  })

}());