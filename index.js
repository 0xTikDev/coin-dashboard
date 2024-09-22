import express from "express";
import ejs from "ejs";
import axios from "axios";


const app = express();
const port = 3000;
let usdtPairs = [];


app.use(express.static("public"));

app.get("/", (req, res)=> {
    res.render("index.ejs");
   

});


app.listen(port, () => {
    console.log(`We up at port ${port}`);
})