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
  
// Function to plot the price of the top 5 cryptocurrencies
async function createTop5CryptoPricePlot() {
  const data = await fetchData();
  const top5Crypto = data.slice(0, 5);
  const trace = {
    x: top5Crypto.map(crypto => crypto.name),
    y: top5Crypto.map(crypto => crypto.price),
    type: 'bar',
  };

  const layout = {
    title: 'Price of The Top 5 Cryptocurrencies',
    yaxis: {
      title: 'Price (USD)',
    },
  };

  Plotly.newPlot('top-5-crypto-price', [trace], layout);
}

// Function to plot the 5 most expenive cryptocurrencies
async function createMostExpensiveCryptoPlot() {
    const data = await fetchData();  
    const top5Crypto = sortByAttribute(data, "price").slice(0, 6);

    const trace = {
      x: top5Crypto.map(crypto => crypto.name),
      y: top5Crypto.map(crypto => crypto.price),
      type: 'bar',
    };
  
    const layout = {
      title: 'Most Expensive Cryptocurrencies',
      yaxis: {
        title: 'Price (USD)',
      },
    };
  
    Plotly.newPlot('top-5-crypto-by-price', [trace], layout);
}
  
// Function to create the pie chart showing top 5 cryptocurrencies by volume
async function createTop3CryptoByVolumePieChart() {
    const data = await fetchData()

    const top_3data = data.slice(0, 3);

    // Calculate the total volume of other cryptocurrencies (excluding the top 3)
    const other_volume = data.slice(3).reduce((sum, currency) => sum + currency.volume, 0);
    
    console.log(other_volume)
    // Create a new array for the pie chart data, including the top 3 and "Others"
    const pie_data = [
      ...top_3data,
      { name: 'Others', volume: other_volume }
    ];

    const trace = {
        values: pie_data.map(e => e.volume),
        labels: pie_data.map(e => e.name),
        type: 'pie',
        hoverinfo: 'label+percent',
    };
        
    const layout = {
        title: "Volume of The Top 3 Cryptocurrencies",
    };
        
    Plotly.newPlot('top-3-crypto-volume', [trace], layout);  
}
  
// Call the functions to create the plots
createTop5CryptoPricePlot();
createMostExpensiveCryptoPlot();
createTop3CryptoByVolumePieChart();
  