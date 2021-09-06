// Date -> Class -> Function Constructor
const date = new Date();
// get month
const month = date.getMonth() + 1;
// get the day (date)
const day = date.getDate();
// get year
const year = date.getFullYear();
var searchInput = $("#search-input")
var formInput = $("#form-input")
var btnInput = $("#search-btn")
const APIKEY = "64f2c72988fa56f79a0b2d9d137d67dc"
const days = parseInt($(this).attr("data-day"))
let forecastparams = {

    q: "",
    appid: APIKEY,
    units: "imperial",


}

$("form").submit(function (event) {
    event.preventDefault()
    forecastparams.q = searchInput.val()


    removelastsearch()
    weatherSearch()
})




// fetchs data from api:forecast
function weatherSearch() {


    var params = new URLSearchParams(forecastparams)
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}`

    fetch(forecastUrl)
        .then((data) => {
            if (data.status === 404) { return alert(`city not found`) }
            return data.json()
        })
        .then((forecastData) => {

            console.log(forecastData)
            const oneCallparams = {


                lat: forecastData.city.coord.lat,
                lon: forecastData.city.coord.lon,
                appid: APIKEY,
                units: "imperial",
            }

            let params = new URLSearchParams(oneCallparams)

            var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?${params}`
            //fetchs data OneCallapi
            fetch(oneCallApi)



                .then((data) => data.json())
                .then((oneCallData) => {
                    console.log(oneCallData)


                    // builds weather cards for each day
                    $(".weather-cards").each(function () {

                        //if new search remove each element


                        const days = parseInt($(this).attr("data-day"))
                        var dailytemp = oneCallData.daily[days].temp.day
                        var dailyfeel = oneCallData.daily[days].feels_like.day
                        var dailywind = oneCallData.daily[days].wind_speed
                        var dailyhumid = oneCallData.daily[days].humidity
                        var dailyuvi = oneCallData.daily[days].uvi



                        //creates the p tags
                        let feelslike = $("<p>")
                        let temp = $("<p>")
                        let wind = $("<p>")
                        let humid = $("<p>")
                        let uvi = $("<p>")



                        //sets the text for the p tags
                        feelslike.text(`Feelslike: ${dailytemp}° F`)
                        temp.text(`Temperature: ${dailyfeel}° F`)
                        wind.text(`Wind: ${dailywind} MPH`)
                        humid.text(`Humidity: ${dailyhumid}%`)
                        uvi.text(`UV index: ${dailyuvi}`)

                        feelslike.attr("id", "feeltemp")
                        temp.attr("id", "temp")
                        wind.attr("id", "wind")
                        humid.attr("id", "humid")
                        uvi.attr("id", "UVI")


                        //classes for for the p tags
                        $(feelslike).addClass("mx-2")
                        $(temp).addClass("mx-2")
                        $(wind).addClass("mx-2")
                        $(humid).addClass("mx-2")
                        $(uvi).addClass("mx-2")



                        //appends the p tags to the cards
                        $(this).append(feelslike).append(temp).append(wind).append(humid).append(uvi)








                    })

                    function currentWeatherBg() {
                        var currentWeather = oneCallData.current.weather[0].main

                        if (currentWeather === `Clouds`) {

                            $("#weather-cards-0").addClass("background-cloud")
                            $("#weather-cards-0").removeClass("background-rain")
                            $("#weather-cards-0").removeClass("background-clear")

                        } else if (currentWeather === `Rain`) {
                            $("#weather-cards-0").addClass("background-rain")
                            $("#weather-cards-0").removeClass("background-cloud")
                            $("#weather-cards-0").removeClass("background-clear")
                        } else {
                            $("#weather-cards-0").addClass("background-clear")
                            $("#weather-cards-0").removeClass("background-cloud")
                            $("#weather-cards-0").removeClass("background-rain")

                        }
                    }

                    currentWeatherBg()

                })
        })
}

$(".weather-cards").each(function () {

    let dayAsce = parseInt($(this).attr("data-day"))
    let date = $("<p>")
    date.text(`${month}/${day + dayAsce}/${year}`)
    $(date).addClass("text-center relative top-1 text-2xl m-1")
    $(this).append(date)

})


function removelastsearch() {

    //if the p tags exist remove them
    $(".weather-cards").each(function () {


        const days = parseInt($(this).attr("data-day"))
        $("#weather-cards-" + days).find("#wind").remove()
        $("#weather-cards-" + days).find("#temp").remove()
        $("#weather-cards-" + days).find("#humid").remove()
        $("#weather-cards-" + days).find("#feeltemp").remove()
        $("#weather-cards-" + days).find("#UVI").remove()
        console.log(days)
    })



}

//clear white-text
//rain white-text
//clouds 





// const form = document.querySelector("#search-weather");
// const recentSearches = document.querySelector("#recent-searches");

// Geo code endpoint
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// One call endpoint
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// form.addEventListener("submit", function (e) {
// e.preventDefault();
    // Retrieve the city name from the input#city-name element
    // and we trim off any extra whitespace
    // const city = document.querySelector("input#city-name").value.trim();

    // Fetch weather data
    // Where are we going to source our data
    // What does the api need to find our city
    // populate our weather details
// });

// recentSearches.addEventListener("click", function (e) {
//     const target = e.target;
//     if (!target.matches("button")) return;
    // Retrieve the city name from the button.textContent
    // Fetch weather data
    // populate our weather details
// });

    // window.navigator.geolocation.getCurrentPosition(function (geoData) {
    //   console.log(geoData);
    // });
