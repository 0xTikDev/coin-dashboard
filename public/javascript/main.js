// SECTION A: DATA RENDERING AND FORMATING FROM BINANCE WEB SOCKET API, DISPLAYED DYNAMICALLY

function stylus(old, current) {
        let color = !old || old === current ? 'black' : current > old ? 'green' : 'red';
        return color

    }

    // format price decimal accordingly
    function formatPrice(price) {
        const value = parseFloat(price);
        if (value > 1) {
            return value.toFixed(2);
        } else if (value < 1 && value >= 0.1) {
            return value.toFixed(4);
        } else if (value < 0.1 && value >= 0.01){
            return value.toFixed(6)

        } else {
            return value.toFixed(8);
        }
    }
    const socket = new WebSocket('wss://data-stream.binance.vision:443/ws/!ticker@arr');
    socket.onmessage = (event) => {
    const tickers = JSON.parse(event.data);
    
    // filter each element and return only USDT pair
    usdtPairs = tickers.filter(ticker => ticker.s.endsWith('USDT')).map(temporal => ({

        s: temporal.s.replace("USDT", ""), // then display only underlying asset without USDT
        c: formatPrice(temporal.c), // call formatPrice function to format price decimal places
        P: parseFloat(temporal.P).toFixed(2),
        v: parseFloat(temporal.v).toFixed(0), //Volumen in quoted asset
        q: parseFloat(temporal.q).toFixed(0) //Volume in USD
    }));

    const tickerBody = document.getElementById("ticker-body");
    tickerBody.innerHTML = '';

    let lastPrice = null;
    let lastChange = null

    
usdtPairs.forEach(ticker => {
    
    let price = ticker.c;
    let change = ticker.P;
    const row = `<tr>
        <td class="symbol">${ticker.s}</td>
        <td class="price" style="color:${stylus(lastPrice, price)}" >$${price}</td>
        <td class="change" style="color: ${stylus(lastChange, change)}">${ticker.P}</td>
        <td class="volume"> <small>${ticker.s}</small> ${ticker.v} </td>
    </tr>`;

    tickerBody.innerHTML += row;
    lastPrice = price; 
    lastChange = change;
});
   


// SECTION B: CHART/GRAPH RENDERING ...

// sort according to  volume descending and cut out the first 10 (volume in USD)
let top20To35 = (usdtPairs.sort((a, b) => {
    return b.q - a.q;
})).slice(19, 35);
let top35To50 = (usdtPairs.sort((a, b) => {
    return b.q - a.q;
})).slice(35, 50);
let leftChart = document.getElementById('chart1').getContext('2d');
let rightChart = document.getElementById('chart2').getContext('2d');
let leftBackground = [
    "#FF5733", "#FFBD33", "#DBFF33", "#75FF33", "#33FF57",
    "#33FFBD", "#33DBFF", "#3375FF", "#335BFF", "#5733FF",
    "#BD33FF", "#FF33DB", "#FF33A6", "#FF3375", "#FF6F33",
    "#FF8D33", "#FFD833", "#D5FF33", "#33FF8D", "#33A6FF"
];
let rightBackground = [
    "#6A1B9A", "#D50000", "#FF6F00", "#FFB300", "#AEEA00",
    "#00C853", "#00B0FF", "#0091EA", "#304FFE", "#6200EA",
    "#FF3D00", "#FFD740", "#69F0AE", "#00E676", "#B2FF59",
    "#FFEA00", "#FFD180", "#FF8A00", "#D500F9", "#FFAB40", "#FF5722"
];
leftLabel = 'Volume: top 20 to 35 tickers';
rightLabel = 'Volume: top 35 to 50 ticker';

function magicChart(pair, htmlTarget, bColor, label) {
    let volumeChart = new Chart(htmlTarget, {
        type: 'radar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: pair.map(target => (target.s)),
            datasets: [{
                label: label, 
                data: pair.map(target => (target.q)),
                backgroundColor: bColor,
                borderWidth:0.1,
                borderColor: 'purple',
            
            }]
        },
        options: {
            scales: {
                r: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    },
                    angleLines: {
                        display: true
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top', 
                    labels: {
                        boxWidth: 10,
                        padding: 10,
                    }
                }
            }
        }
    });
    return volumeChart;
}
magicChart(top20To35, leftChart, leftBackground, leftLabel);
magicChart(top35To50, rightChart, rightBackground, rightLabel);
    
};
    
