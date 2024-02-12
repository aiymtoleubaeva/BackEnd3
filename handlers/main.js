const express = require("express");
const { MongoClient } = require('mongodb');
const router = express.Router();
const https = require("https");
const weather = "14882d9791674ae40196bb2a87f7dd81";

const dbURL = 'mongodb+srv://aiym:aiymaiym@cluster0.ug3bscp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

router.get("/weather", async (req, res) => {
  let isRegistered = true
  const name = req.session.name

  if (!name) {
    res.redirect('/login')
    return
  }

  const city = req.query.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weather}`;

  try {
    if (city !== undefined) {
      
      const weatherdata = await fetchData(url);
      const icon = weatherdata.weather[0].icon;
      const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const temp = weatherdata.main.temp;
      const description = weatherdata.weather[0].description;
      const feelsLike = weatherdata.main.feels_like;
      const info = { temp, feelsLike, description, imgURL, city };
      res.render("weather", { weather: info, isRegistered});
      return;
    } 
    res.render("weather", { weather: undefined, isRegistered});
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
});

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load data, status code: ' + response.statusCode));
      }
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (error) => reject(error));
  });
}


router.get("/", (req, res) => {
  const name = req.session.name
  let isRegistered = true
  if (!name) {
    isRegistered = false
  }
  res.render("weather", {isRegistered});
});


module.exports = router;
