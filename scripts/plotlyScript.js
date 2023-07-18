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
  
// Function to plot the price of the top 10 ranked crypto currencies
async function createTop10CryptoPricePlot() {
    const data = await fetchData();  
    const top10Crypto = sortByAttribute(data, "price").slice(0, 10);
    
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
    const data = (await fetchData())

    top_5data = sortByAttribute(data, "volume").slice(0, 5);

    const trace = {
        values: top_5data.map(e => e.volume),
        labels: top_5data.map(e => e.name),
        type: 'pie'
    };
        
    const layout = {
        title: "Top 5 Crypto By Volume",
    };
        
    Plotly.newPlot('top-5-crypto-volume', [trace], layout);  
}
  
// Call the functions to create the plots
createTop10CryptoPricePlot();
createTop5CryptoByVolumePieChart();
  