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

async function createTopCurrenciesPriceBarChart() {
  const data = await fetchData();

  // Sort the data by price in descending order
  const top5Crypto = data.slice(0, 6);

  // Set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#top-5-crypto-price").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
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
    .domain([0, d3.max(top5Crypto, crypto => crypto.price)])
    .range([height, 0]);

  svg.append("g")
     .call(d3.axisLeft(y));

  // Add bars
  svg.selectAll(".bar")
    .data(top5Crypto)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", crypto => x(crypto.name))
    .attr("y", crypto => y(crypto.price))
    .attr("width", x.bandwidth())
    .attr("height", crypto => height - y(crypto.price))
    .attr("fill", "steelblue")
    .on("mouseover", function(d) {
      // Show tooltip on mouseover
      d3.select("#tooltip")
        .style("visibility", "visible")
        .html(`<strong>${d.name}</strong><br>Price: $${d.price.toFixed(2)}`);
    })
    .on("mousemove", function() {
      // Position tooltip next to the cursor
      d3.select("#tooltip")
        .style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      // Hide tooltip on mouseout
      d3.select("#tooltip").style("visibility", "hidden");
    });

  // Create tooltip element
  d3.select("#top-5-crypto-price")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "5px");
}


async function createMostExpensiveCurrenciesBarChart() {
  const data = await fetchData();

  // Sort the data by price in descending order
  const top5Crypto = data.slice().sort((a, b) => b.price - a.price).slice(0, 6);

  // Set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 90, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

  const svg = d3.select("#top-5-crypto-by-price").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
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
    .domain([0, d3.max(top5Crypto, crypto => crypto.price)])
    .range([height, 0]);

    svg.append("g")
    .call(d3.axisLeft(y).ticks(7));

  // Add bars
  svg.selectAll(".bar")
    .data(top5Crypto)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", crypto => x(crypto.name))
    .attr("y", crypto => y(crypto.price))
    .attr("width", x.bandwidth())
    .attr("height", crypto => height - y(crypto.price))
    .attr("fill", "steelblue")
    .on("mouseover", function(d) {
      // Show tooltip on mouseover
      d3.select("#tooltip")
        .style("visibility", "visible")
        .html(`<strong>${d.name}</strong><br>Price: $${d.price.toFixed(2)}`);
    })
    .on("mousemove", function() {
      // Position tooltip next to the cursor
      d3.select("#tooltip")
        .style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      // Hide tooltip on mouseout
      d3.select("#tooltip").style("visibility", "hidden");
    });

  // Create tooltip element
  d3.select("#top-5-crypto-by-price")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "5px");
}

  
async function createTop3CryptoByVolumePieChart() {
  var data = await fetchData();

  const top_3data = data.slice(0, 3);

  // Calculate the total volume of other cryptocurrencies (excluding the top 3)
  const other_volume = data.slice(3).reduce((sum, currency) => sum + currency.volume, 0);

  // Create a new array for the pie chart data, including the top 3 and "Others"
  const pie_data = [
    ...top_3data,
    { name: 'Others', volume: other_volume }
  ];

  const totalVolume = data.reduce((sum, currency) => sum + currency.volume, 0);

  // set the dimensions and margins of the graph
  var width = 450,
    height = 450,
    margin = 40;

  // The radius of the pie plot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div
  var svg = d3.select("#top-3-crypto-volume")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(pie_data.map(d => d.name))
    .range(d3.schemeSet2);

  // Compute the position of each group on the pie
  var pie = d3.pie()
    .value(function(d) { return d.volume; });
  var data_ready = pie(pie_data);

  // shape helper to build arcs
  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  var slices = svg.selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('g')
    .attr('class', 'slice');

  slices.append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d) { return color(d.data.name); })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .on("mouseover", function(d) {
      // Show tooltip on mouseover
      const percentage = (d.value / totalVolume) * 100;
      d3.select("#tooltip")
        .style("visibility", "visible")
        .html(`<strong>${d.data.name}</strong><br>Percentage: ${percentage.toFixed(1)}%`);
    })
    .on("mousemove", function() {
      // Position tooltip next to the cursor
      d3.select("#tooltip")
        .style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      // Hide tooltip on mouseout
      d3.select("#tooltip").style("visibility", "hidden");
    });

  // Add the annotation (rotated text) inside each slice
  slices.append('text')
    .attr("transform", function(d) {
      var angle = (d.startAngle + d.endAngle) / 2;
      var rotate = (angle < Math.PI) ? angle : angle + Math.PI; // Choose rotation direction based on quadrant
      return "translate(" + arcGenerator.centroid(d) + ") rotate(" + (rotate * 180 / Math.PI - 90) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) { return d.data.name; })
    .style("font-size", 14);

  // Create tooltip element
  d3.select("#top-3-crypto-volume")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "5px");
}
  
  // Call the functions to create the plots
  createTopCurrenciesPriceBarChart();
  createMostExpensiveCurrenciesBarChart();
  createTop3CryptoByVolumePieChart();  