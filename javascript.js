

const APIKEY = "64f2c72988fa56f79a0b2d9d137d67dc"

var cityNameInput = "boca raton"

// var CurrentWeatherUrl = `api.openweathermap.org/data/2.5/forecast?q=${cityNameInput}&appid=${APIKEY}`
var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameInput}&appid=${APIKEY}&units=imperial`

// call back hell
fetch(forecastUrl)
    .then((data) => data.json())
    .then((forecastData) => {
        console.log(forecastData)
        var lon = forecastData.city.coord.lon
        var lat = forecastData.city.coord.lat

        var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${APIKEY}`

        fetch(oneCallApi)
            .then((data) => data.json())
            .then((oneCallData) => {
                console.log(oneCallData)

                var uvi = oneCallData.current.uvi
                console.log(uvi)

            })
    })


const form = document.querySelector("#search-weather");
const recentSearches = document.querySelector("#recent-searches");

// const api_key = "2083ba99e548234fc6955819000762a8";
// Geo code endpoint
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// One call endpoint
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Retrieve the city name from the input#city-name element
    // and we trim off any extra whitespace
    const city = document.querySelector("input#city-name").value.trim();

    // Fetch weather data
    // Where are we going to source our data
    // What does the api need to find our city
    // populate our weather details
});

recentSearches.addEventListener("click", function (e) {
    const target = e.target;
    if (!target.matches("button")) return;
    // Retrieve the city name from the button.textContent
    // Fetch weather data
    // populate our weather details
});

    // window.navigator.geolocation.getCurrentPosition(function (geoData) {
    //   console.log(geoData);
    // });
