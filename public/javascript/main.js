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
        v: parseFloat(temporal.v).toFixed(0)
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
   

    };
    


// SECTION B: CHART/GRAPH RENDERING ...