async function main() {
    const apiKey = '69603966b2664b3e9c4a1f329b1742c5';
    const symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];
    const interval = '1day';

    try {
        const fetchPromises = symbols.map(async (symbol) => {
            const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching data for ${symbol}`);
            }

            return response.json();
        });

        const responseData = await Promise.all(fetchPromises);

        responseData.forEach((data, index) => {
            const symbol = symbols[index];
            console.log(`Data for symbol ${symbol}:`, data);
        });

        createStockChart(responseData, symbols);
        createHighestPriceChart(responseData, symbols);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

main();

function createStockChart(stocksData, symbols) {
    const timeChartCanvas = document.querySelector('#time-chart');
    const timeChartData = {
        labels: stocksData[0].values.map(value => value.datetime),
        datasets: stocksData.map((stock, index) => ({
            label: symbols[index],
            data: stock.values.map(value => parseFloat(value.high)),
            backgroundColor: getColor(symbols[index]),
            borderColor: getColor(symbols[index]),
            fill: false,
        }))
    };

    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: timeChartData,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                    }
                },
                y: {
                    beginAtZero: false,
                }
            }
        }
    });
}

function createHighestPriceChart(stocksData, symbols) {
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const highestPriceChartData = {
        labels: symbols,
        datasets: [{
            label: 'Highest Stock Price',
            data: stocksData.map(stock => parseFloat(stock.values[0].high)),
            backgroundColor: symbols.map(stock => getColor(stock)),
            borderColor: symbols.map(stock => getColor(stock)),
            borderWidth: 1
        }]
    };

    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: highestPriceChartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getColor(stock) {
    if (stock === 'GME') {
        return 'rgba(61, 161, 61, 0.7)';
    }
    if (stock === 'MSFT') {
        return 'rgba(209, 4, 25, 0.7)';
    }
    if (stock === 'DIS') {
        return 'rgba(18, 4, 209, 0.7)';
    }
    if (stock === 'BNTX') {
        return 'rgba(166, 43, 158, 0.7)';
    }
}