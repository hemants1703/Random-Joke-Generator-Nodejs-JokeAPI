const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

let setup = "Press the button,";
let delivery = "and get a joke!";

app.get("/", (req, res) => {
    if(setup === undefined || delivery === undefined || setup === "" || delivery === "") 
        res.render("index", {
            setupH: "Sorry, API not responding!",
            deliveryH: "Please try again!"
        });
    else
        res.render("index", {
                setupH: setup,
                deliveryH: delivery
        });
});

app.post("/", (req, res) => {

    const options = {
        hostname: "v2.jokeapi.dev",
        port: 443,
        path: "/joke/Programming,Spooky,Christmas",
        method: "GET"
    };
    
    https.request(options, nodeRes => {
        nodeRes.on("data", chunk => {
            let jokeResponse = JSON.parse(chunk);
            setup = jokeResponse.setup;
            delivery = jokeResponse.delivery;
            console.log(setup);
            console.log(delivery); 
        });
    }).on("error", error => {
        console.error(error);
    }).end();

    res.redirect("/");

});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
