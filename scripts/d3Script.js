//Helper Functions
const parseNumbers = (str) => parseFloat((str || "0").replace(/[^0-9.]/g, ""));
const sortByAttribute = (array, attribute) => array.slice().sort((a, b) => b[attribute] - a[attribute]);

// Function to fetch the data from the JSON file
async function fetchData() {
    const response = await (await fetch('data/data.json')).json();
    const converted = response.map((e) => Object.assign({}, {
        ...e,
        price: parseNumbers(e.price),
        volume: parseNumbers(e.volume)
    }))
    return converted;
}

// Function to create the bar chart showing the most expensive cryptocurrencies
async function createTopCurrenciesPriceBarChart() {
  const data = await fetchData();

  // Sort the data by price in descending order
  const top5Crypto = data.slice(0, 6);

  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 70, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


  const svg = d3.select("#top-5-crypto-price").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(top5Crypto.map(function(d) { return d.name; }))
    .padding(0.2);
    
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0,  d3.max(top5Crypto, crypto => crypto.price)])
    .range([ height, 0]);

  svg.append("g")
     .call(d3.axisLeft(y));
  
    svg.selectAll(".bar")
    .data(top5Crypto)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", crypto => x(crypto.name))
    .attr("y", crypto => y(crypto.price))
    .attr("width", x.bandwidth())
    .attr("height", crypto => height - y(crypto.price))
    .attr("fill", "steelblue");

  // Bars
  svg.selectAll("mybar")
  .data(top5Crypto)
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.name); })
  .attr("y", function(d) { return y(d.price); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.Value); })
  .attr("fill", "#69b3a2")

}


// Function to create the bar chart showing the most expensive cryptocurrencies
async function createMostExpensiveCurrenciesBarChart() {
    const data = await fetchData();
  
    // Sort the data by price in descending order
    const top5Crypto = sortByAttribute(data, "price").slice(0, 6);
  
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  
    const svg = d3.select("#top-5-crypto-by-price").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // X axis
      var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(top5Crypto.map(function(d) { return d.name; }))
      .padding(0.2);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,  d3.max(top5Crypto, crypto => crypto.price)])
      .range([ height, 0]);

    svg.append("g")
       .call(d3.axisLeft(y));
    
      svg.selectAll(".bar")
      .data(top5Crypto)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", crypto => x(crypto.name))
      .attr("y", crypto => y(crypto.price))
      .attr("width", x.bandwidth())
      .attr("height", crypto => height - y(crypto.price))
      .attr("fill", "steelblue");

    // Bars
    svg.selectAll("mybar")
    .data(top5Crypto)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.name); })
    .attr("y", function(d) { return y(d.price); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Value); })
    .attr("fill", "#69b3a2")

  }

  
// Function to create the pie chart showing top 3 cryptocurrencies by volume
async function createTop3CryptoByVolumePieChart() {
  var data = await fetchData()

  const top_3data = data.slice(0, 3);
  console.log(top_3data)
  // Calculate the total volume of other cryptocurrencies (excluding the top 3)
  const other_volume = data.slice(3).reduce((sum, currency) => sum + currency.volume, 0);

  // Create a new array for the pie chart data, including the top 3 and "Others"
  const pie_data = [
    ...top_3data,
    { name: 'Others', volume: other_volume }
  ];

  const data_dict = {};
  pie_data.forEach((e) => {
    data_dict[e.name] = e.volume;
  });

// set the dimensions and margins of the graph
var width = 450,
height = 450,
margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div
var svg = d3.select("#top-3-crypto-volume")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data_dict)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data_dict))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
.selectAll('mySlices')
.data(data_ready)
.enter()
.append('path')
.attr('d', arcGenerator)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg
.selectAll('mySlices')
.data(data_ready)
.enter()
.append('text')
.text(function(d){ return d.data.key})
.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
.style("text-anchor", "middle")
.style("font-size", 17)

}
  
  // Call the functions to create the plots
  createTopCurrenciesPriceBarChart();
  createMostExpensiveCurrenciesBarChart();
  createTop3CryptoByVolumePieChart();  