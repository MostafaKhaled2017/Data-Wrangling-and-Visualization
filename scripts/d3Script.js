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

  
// Function to create the pie chart showing top 5 cryptocurrencies by volume
async function createTop5CryptoByVolumePieChart() {
  const data = (await fetchData())

  const top_5data = data.slice(0, 5);

  // Calculate the total volume of other cryptocurrencies (excluding the top 5)
  const other_volume = data.slice(5).reduce((sum, currency) => sum + currency.volume, 0);

  // Create a new array for the pie chart data, including the top 5 and "Others"
  const pie_data = [
    ...top_5data,
    { name: 'Others', volume: other_volume }
  ];



}
  
  // Call the functions to create the plots
  createTopCurrenciesPriceBarChart();
  createMostExpensiveCurrenciesBarChart();
  createTop5CryptoByVolumePieChart();  