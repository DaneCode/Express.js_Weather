const express = require("express");
const https = require("https");
require('dotenv').config();
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

var items = [];

// port number and api key in hidden file
const PORT=process.env.PORT
const openWeatherAPI=process.env.openWeatherAPI

// function to redirect to the index page
app.get("/", (req, res) => {
  res.render("list", {listItems: items})
});

// Post request take the city name input and calls data from openweathermap
app.post("/", (req, res) => {
  items = [];
  const query = req.body.cityName;
  items.push(query);
  // this app uses Open Weather Map for its source of data. Signup there to get api key
  const apiKey = openWeatherAPI;
  // this can be changed to metric if you want the temp in celc
  const unit = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",US&appid="+ apiKey +"&units=" + unit;
  // this is the get request that parses the data and writes it to the page
  https.get(url, (response) => {
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon
      const imageURL = 'http://openweathermap.org/img/wn/' + icon + "@2x.png"
      items.push(temp);
      items.push(weatherDescription);
      items.push(imageURL);
      res.redirect("/");
    })
  });
})

// listening to port 3000
app.listen(PORT, function() {
  console.log("Server is Running!")
})
