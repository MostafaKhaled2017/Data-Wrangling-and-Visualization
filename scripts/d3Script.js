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


// Function to create the bar chart showing top 10 cryptocurrencies by price
async function createTop10CryptoByPriceBarChart() {
    const data = await fetchData();
  
    // Sort the data by price in descending order
    const top10Crypto = sortByAttribute(data, "price").slice(0, 10);
  
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  
    const svg = d3.select("#graphBar").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      // X axis
      var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(top10Crypto.map(function(d) { return d.name; }))
      .padding(0.2);
      
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,  d3.max(top10Crypto, crypto => crypto.price)])
      .range([ height, 0]);

    svg.append("g")
       .call(d3.axisLeft(y));
    
      svg.selectAll(".bar")
      .data(top10Crypto)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", crypto => x(crypto.name))
      .attr("y", crypto => y(crypto.price))
      .attr("width", x.bandwidth())
      .attr("height", crypto => height - y(crypto.price))
      .attr("fill", "steelblue");

      // Bars
    svg.selectAll("mybar")
    .data(top10Crypto)
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
    const data = await fetchData();
  
    // Sort the data by volume in descending order
    const top5Crypto = sortedData.slice(0, 5);
  
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3.select("#graphPie").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const pie = d3.pie()
      .value(crypto => crypto.volume)
      .sort(null);
  
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
  
    const labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);
  
    const arcs = svg.selectAll(".arc")
      .data(pie(top5Crypto))
      .enter().append("g")
      .attr("class", "arc");
  
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", crypto => color(crypto.data.name));
  
    arcs.append("text")
      .attr("transform", crypto => "translate(" + labelArc.centroid(crypto) + ")")
      .attr("dy", ".35em")
      .text(crypto => crypto.data.name);
  }
  
  // Call the functions to create the plots
  createTop10CryptoByPriceBarChart();
  createTop5CryptoByVolumePieChart();  