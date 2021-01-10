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

var xAxisDict = {
    "poverty":"Poverty %",
    "age":"Age (median)",
    "income":"Household Income (median)"
};

var yAxisDict = {
    "obese":"Obesity %",
    "smokes":"Smokers %",
    "healthcare":"Lacks Healthcare %"
};

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

function xAxisLabels(xAxisDict, xlabelsGroup) {
    var status="";
    var space=20;
    for (var key in xAxisDict) {
            if (key==chosenXAxis) {
                status = "active"
            }
            else {
                status = "inactive"
            }
        xlabelsGroup.append("text")
            .attr("x",0)
            .attr("y",space)
            .attr("value",key)
            .classed(status,true)
            .text(xAxisDict[key]);
        space += 20;
    }
}

function yAxisLabels(yAxisDict, ylabelsGroup) {
    var status="";
    var space=0;

    for (var key in yAxisDict) {
        if (key==chosenYAxis) {
            status = "active"
        }
        else {
            status = "inactive"
        }
        ylabelsGroup.append("text")
            .attr("y", 0 - margin.left+space)
            .attr("x", 0 - (height / 2))
            .attr("dy","1em")
            .attr("value",key)
            .classed(status,true)
            .text(yAxisDict[key]);
        space += 20;
    }
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    console.log("xaxis value :",chosenXAxis);
    var toolTip = d3.tip()
        .attr("class","d3-tip")
        .offset([100,0])
        .html(function(d) {
            return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}%
                    <br>${chosenYAxis}: ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);
        
    circlesGroup
        .on("mouseover", function(d) {
        toolTip.show(d, this);
    })
        .on("mouseout", function(d,i) {
            toolTip.hide(d, this);
        });
    return circlesGroup;
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

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    xAxisLabels(xAxisDict, xlabelsGroup); 
    yAxisLabels(yAxisDict, ylabelsGroup);
    updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
    });
  