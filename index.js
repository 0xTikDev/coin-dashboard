import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
// get coingecko api Key fill in apiKey https://www.coingecko.com/en/developers/dashboard
const config = {params: { apiKey: "" }};
const URL = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=";
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    try {
    const result = await axios.get(URL + "bitcoin", config);
    const data = result.data;
    res.render("index.ejs", {price: USDollar.format(data.bitcoin.usd), currency:"BTC"});
    } catch (error) {
        res.render("index.ejs", {price: "Server side error", currency: "BTC"});
    }
});

app.post("/dropdown", async(req, res) => {
    try {
        const idHolder = req.body.coin;
        const result = await axios.get(URL + idHolder, config);
        const data = result.data;
        res.render("index.ejs", {price: USDollar.format(data[idHolder].usd), currency: req.body.coin});
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs", {price: "Server side error: sit tight", currency: req.body.coin});
        
    }
});

app.listen(port, ()=> {
    console.log("WE up at port " + port);
});

