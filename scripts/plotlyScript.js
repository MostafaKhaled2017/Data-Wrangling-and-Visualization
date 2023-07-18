// Function to fetch the data from the JSON file
async function fetchData() {
    const response = await fetch('data/data.json');
    return await response.json();
  }
  
// Function to plot the price of the top 10 ranked crypto currencies
async function createTop10CryptoPricePlot() {
    const data = await fetchData();
  
    const top10Crypto = data.slice(0, 10);
  
    const trace = {
      x: top10Crypto.map(crypto => crypto.name),
      y: top10Crypto.map(crypto => crypto.price),
      type: 'bar',
    };
  
    const layout = {
      title: 'Top 10 Cryptocurrencies Price',
      xaxis: {
        title: 'Cryptocurrency',
      },
      yaxis: {
        title: 'Price (USD)',
      },
    };
  
    Plotly.newPlot('top-10-crypto-price', [trace], layout);
  }
  
  // Function to create the pie chart showing top 5 cryptocurrencies by volume
  async function createTop5CryptoByVolumePieChart() {
    const data = await fetchData();
  
    // Sort the data by volume in descending order
    data.sort((a, b) => b.volume - a.volume);
  
    const top5Crypto = data.slice(0, 5);
  
    const trace = {
      labels: top5Crypto.map(crypto => crypto.name),
      values: top5Crypto.map(crypto => crypto.volume),
      type: 'pie',
    };
  
    const layout = {
      title: 'Top 5 Cryptocurrencies by Volume',
    };
  
    Plotly.newPlot('top-5-crypto-by-volume', [trace], layout);
  }
  
  // Call the functions to create the plots
  createTop10CryptoPricePlot();
  createTop5CryptoByVolumePieChart();
  