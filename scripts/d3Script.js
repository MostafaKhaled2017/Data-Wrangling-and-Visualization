// Function to fetch the data from the JSON file
async function fetchData() {
    const response = await fetch('data/data.json');
    return await response.json();
  }
  
  // Function to create the bar chart showing top 10 cryptocurrencies by price
  async function createTop10CryptoByPriceBarChart() {
    const data = await fetchData();
  
    // Sort the data by price in descending order
    const sortedData = data.slice().sort((a, b) => b.price - a.price);
    const top10Crypto = sortedData.slice(0, 10);
  
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select("#graphBar").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  
    const x = d3.scaleBand()
      .domain(top10Crypto.map(crypto => crypto.name))
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(top10Crypto, crypto => crypto.price)])
      .range([height, 0]);
  
    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    g.selectAll(".bar")
      .data(top10Crypto)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", crypto => x(crypto.name))
      .attr("y", crypto => y(crypto.price))
      .attr("width", x.bandwidth())
      .attr("height", crypto => height - y(crypto.price))
      .attr("fill", "steelblue");
  
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
  
    g.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    g.append("g")
      .attr("class", "axis axis-y")
      .call(yAxis);
  }
  
  // Function to create the pie chart showing top 5 cryptocurrencies by volume
  async function createTop5CryptoByVolumePieChart() {
    const data = await fetchData();
  
    // Sort the data by volume in descending order
    const sortedData = data.slice().sort((a, b) => b.volume - a.volume);
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