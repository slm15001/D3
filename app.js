


// Step 1: Set up chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20 ,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,.
//= =========================================================================================================================
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3: Import Data
d3.csv("./data/data.csv", function (err, povertyData) {
  if (err) throw err;

  // Step 4: Parse Data/Cast as numbers
   // ==============================
   povertyData.forEach(function (data) {
    data.poverityRate = +data.poverityRate;
    data.obesityRate = parseInt(data.obesityRate);
  });

  // Step 5: Add scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([2, d3.max(povertyData, d => d.poverityRate)])
    .range([2, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(povertyData, d => d.obesityRate)])
    .range([height, 20]);

  // Step 6:  axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 7:  Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(6, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 8: Build Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(povertyData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverityRate))
  .attr("cy", d => yLinearScale(d.obesityRate))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  // step 9: text on the cicles
  //= ==================================
  var textGroup = chartGroup.selectAll("#circleText")
  .data(povertyData)
  .enter()
  .append("text")
  .text(d => d.stateAbbr)
  .attr("id", "circleText")
  .attr("x", d => xLinearScale(d.poverityRate)-5)
  .attr("y", d => yLinearScale(d.obesityRate)+4)
  .attr("stroke-width", "1")
  .attr("fill", "white")
  .attr("font-size", 8);
  

  // Step 10: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([90, -60])
    .html(d =>
      `${d.state}<br>poverity Rate: ${d.poverityRate}<br>obesity Rate: ${d.obesityRate}`
    );

  // Step 11: tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 12: event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Step 13: axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("obesity rate");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("poverity rate");
});



