(function () {

  // set the dimensions and margins of the graph
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const bar_color = "#b57302"

  // append the svg object to the body of the page
  const svg = d3.select("#deadly_yearly")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.csv("/data/deadly_yrly.csv").then(function (data) {
    
    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d["YEAR"]))
      .padding(0.1);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
      

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 400])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));


    // ----------------
    // Create a tooltip
    // ----------------
    const Tooltip = d3.select("#deadly_yearly")
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
      Tooltip.html("The exact value of<br>this cell is: " + d.DEADLY)
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
    console.log(data["DEADLY"])

    // Bars
    svg.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", d => x(d["YEAR"]))
      .attr("y", d => {
        console.log(d)
        return y(d["DEADLY"])
      
      })
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d["DEADLY"]))
      .attr("fill", bar_color)
      .attr("width", x.bandwidth())
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  })
  
})();