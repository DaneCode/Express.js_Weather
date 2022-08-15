const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const query = req.body.cityName;
  const apiKey = "259a575b88a5aa7f5f754e59958903a8";
  const unit = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",US&appid="+ apiKey +"&units=" + unit;

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon
      const imageURL = 'http://openweathermap.org/img/wn/' + icon + "@2x.png"
      res.write("<h1>The temperature in " + query + " is " + temp + " Degrees Fahrenheit</h1>");
      res.write("<h1>The weather is currently " + weatherDescription + ".</h1>");
      res.write("<img src="+imageURL+">");
      res.send();
    })
  });
})



app.listen(3000, function() {
  console.log("Server is Running On Port 3000!")
})
