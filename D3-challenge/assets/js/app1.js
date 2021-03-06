// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 1060;
var svgHeight =660;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 20,
  bottom: 90,
  left: 90
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
            d3.max(censusData, d => d[chosenXAxis]) * 1.10
        ])
        .range([0, width]);
  
    return xLinearScale;
    }

function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.9,
        d3.max(censusData, d => d[chosenYAxis]) * 1.10
        ])
        .range([0, height]);
      
    return yLinearScale;
    }

// function used for updating xAxis var upon click on axis label

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
   }  

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
    
  }

function renderText(textGroup, newXScale, chosenXAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textGroup;
    
  }
// function renderCircles(circlesGroup, newYScale, chosenYaxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cy", d => newYScale(d[chosenYAxis]));
  
//     return circlesGroup;
//   }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var Xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age") {
        var Xlabel = "Age:";
    }
    else if (chosenXAxis === "income"){
        var Xlabel = "Income:";
    }

    if (chosenYAxis === "obesity") {
        var Ylabel = "Obesity:";
    }
    else if (chosenYAxis === "smokes") {
        var Ylabel = "Age:";
    }
    else if (chosenYAxis === "healthcare"){
        var Xlabel = "Healthcare:";
    }   

    // var toolTip = d3.tip()
    //     .attr("class", ".d3-tip")
    //     .offset([0, 0])
    //     .html(function(d) {
    //         return (`<center>${Xlabel} ${d[chosenXAxis]}<br>${Ylabel} ${d[chosenYAxis]}</center>`);
    // });

    // circlesGroup.call(toolTip);

    // circlesGroup.on("mouseover", function(data) {
    //     toolTip.show(data);
    // })
    //     // onmouseout event
    //     .on("mouseout", function(data, index) {
    //         toolTip.hide(data);
    //     });

    // var toolTip = d3.select("#svg").append("div")   
    //     .attr("class", "#d3-tip")               
    //     .style("opacity", 0)
    //     .html(function(d) {
    //         return (`<center>${Xlabel} ${d[chosenXAxis]}<br>${Ylabel} ${d[chosenYAxis]}</center>`)
    //     })

    // circlesGroup.call(toolTip);

    // circlesGroup.on("mouseover", function(d) { 
    //         toolTip.show(d);     
    //         toolTip.transition().duration(200).style("opacity", .9); 
    //         toolTip.html(d)  
    //           .style("left", (parseInt(d3.select(this).attr("cx")) + document.getElementById("svg").offsetLeft) + "px")     
    //           .style("top", (parseInt(d3.select(this).attr("cy")) + document.getElementById("svg").offsetTop) + "px");    
    //       })                  
    //       .on("mouseout", function(d) {       
    //         toolTip.transition().duration(500).style("opacity", 0);   
    //       });

    return circlesGroup;
};
    
d3.csv("/assets/data/data.csv").then(function(censusData) {
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        abbrev = data.abbr;

    console.log(censusData)        
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(censusData, d => d.obesity)])
    // .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0, ${width})`)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "lime")
        .attr("opacity",".5")
        .attr("stroke","black")
        .attr("stroke-width","3px");

    var textGroup = circlesGroup.select("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+7)
        .attr("text-anchor","middle")
        .attr("font-family", "serif")
        .attr("font-size", "20px")
        .text(function (d) {return(d.abbr)})
        .style("fill", "black");

    // Create group for  3 x- axis labels
    var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");
    
    var incomeLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Household Income");

    var ageLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");
    
    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
    .on("click", function() {

      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "income") {
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);  
      }
    }
  });
}).catch(function(error) {
console.log(error);
});