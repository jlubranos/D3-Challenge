// D3 - Challenge Healthcare .vs. Poverty Scatterplot
// Boiler Plate svg setup...
var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(census,chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(census,d=>d[chosenXAxis]) * 0.95,
                d3.max(census,d=>d[chosenXAxis]) * 1.05])
        .range([0,width]);

    return xLinearScale;
}

function yScale(census, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(census,d=>d[chosenYAxis]) * 0.8,
            d3.max(census,d=>d[chosenYAxis]) * 1.1])
        .range([height,0]);

    return yLinearScale;
}

    d3.csv("assets/data/data.csv").then(function(census, err) {
        if (err) throw err;
  
    // parse data
        census.forEach(function(state) {
            state.id = +state.id;

            // X Axis Variables  
            state.age = +state.age;
            state.poverty = +state.poverty;
            state.income = +state.income;

            // Y Axis Variables
            state.obesity = +state.obesity;
            state.obesityLow = +state.obesityLow;
            state.obesityHigh = +state.obesityHigh;

            state.smokes = +state.smokes;
            state.smokesLow = +state.smokesLow;
            state.smokesHigh = +state.smokesHigh;

            state.healthcare = +state.healthcare;
            state.healthcareLow = +state.healthcareLow;
            state.healthcareHigh = +state.healthcareHigh;
        });
    console.log("Data :",census);

    var xLinearScale = xScale(census,chosenXAxis);
    var yLinearScale = yScale(census,chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis)

    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        
    });
  