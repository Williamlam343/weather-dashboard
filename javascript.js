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

let recentSearchesArr = []
let forecastparams = {
    q: "",
    appid: APIKEY,
    units: "imperial",

}


// console.log(recentSearchesArr)
formInput.submit(function (event) {
    event.preventDefault()

    // adds the search input into search params object
    forecastparams.q = searchInput.val().trim()
    // returns of no value is given
    if (forecastparams.q === "") return
    // displays the current city being searched
    $("#currentWeather").text(`Current Weather: ${forecastparams.q}`)
    // adds a recent search button after each search

    removelastsearch()
    weatherSearch()
})

// TODO function to search recent searches



// when that button is pressed fetch the run weatherSearch


// fetchs data from api:forecast
function weatherSearch() {


    var params = new URLSearchParams(forecastparams)
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}`

    fetch(forecastUrl)
        .then((data) => {
            //checks if city exist return alert city not found if it doesn't
            if (data.status === 404) { return alert(`city not found`); }


            if (JSON.parse(localStorage.getItem("cities")) !== null) {
                recentSearchesArr = JSON.parse(localStorage.getItem("cities"))
            }

            //adds the city names into a set
            recentSearchesArr.push(searchInput.val().trim())

            // set the array into a set so there are no repeat values
            let uniqueCities = [...new Set(recentSearchesArr)]

            // limit recent searches to seven cities

            if (uniqueCities.length > 7) { uniqueCities.shift() }

            // stores the city names after coverting it into an set
            localStorage.setItem("cities", JSON.stringify(uniqueCities))

            // removes btn element if it exceeds 7 btn
            if ($("#recent-flexbox").find("button").length >= 7) { $("#recent-flexbox").find("button")[0].remove() }

            if (uniqueCities !== undefined && uniqueCities !== "") {

                let recentBtn = $("<button>")
                $(recentBtn).text(uniqueCities[uniqueCities.length - 1])
                $(recentBtn).attr("type", "submit")
                $(recentBtn).attr("data-btnNum", uniqueCities.length - 1)
                $(recentBtn).addClass(" flex-auto border border-gray-400 bg-gray-200 text-gray-700 rounded-md py-2 my-3 w-full transition duration-500 ease select-none hover:bg-gray-300 recent-btn ")
                $("#recent-flexbox").append(recentBtn)
            }

            return data.json()

        })
        .then((forecastData) => {
            if (forecastData === undefined) { return }
            // console.log(forecastData)

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

                        const days = parseInt($(this).attr("data-day"))

                        var dailytemp = oneCallData.daily[days].temp.day
                        var dailyfeel = oneCallData.daily[days].feels_like.day
                        var dailywind = oneCallData.daily[days].wind_speed
                        var dailyhumid = oneCallData.daily[days].humidity
                        var dailyuvi = oneCallData.daily[days].uvi
                        var dailyicon = oneCallData.daily[days].weather[0].main

                        //* adds weather icon conditons
                        let icon = $("<img>")

                        //if cloudy display clouds icon
                        if (dailyicon === `Clouds`) {
                            //set attributes
                            icon.attr("src", "./img/cloudyicon.png")
                            //set classes
                            $(this).addClass("bg-gradient-to-b from-gray-200 to-blue-200")

                        }
                        // if rainy display rainy icon
                        else if (dailyicon === `Rain`) {

                            //set attributes
                            icon.attr("src", "./img/rainyicon.png")
                            //set classes
                            $(this).addClass("bg-gradient-to-b from-gray-100 to-gray-400")

                        }
                        // displays clear icon is not rainy or cloudy
                        else {

                            //set attributes
                            icon.attr("src", "./img/clearicon.png")
                            //set classes
                            $(this).addClass("bg-gradient-to-b from-gray-200 to-yellow-100")
                        }

                        $("#weather-cards-" + days).append(icon)

                        //creates the p tags
                        let feelslike = $("<p>")
                        let temp = $("<p>")
                        let wind = $("<p>")
                        let humid = $("<p>")
                        let uvi = $("<p>")


                        //  else if they are rainy display rain icon
                        // else display sun icon

                        //sets the text for the p tags
                        feelslike.text(`Feelslike: ${dailytemp}° F`)
                        temp.text(`Temperature: ${dailyfeel}° F`)
                        wind.text(`Wind: ${dailywind} MPH`)
                        humid.text(`Humidity: ${dailyhumid}%`)
                        uvi.text(`UV index: ${dailyuvi}`)

                        // adds attribute to the p tags
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
                        $(uvi).addClass("mx-2 text-black w-max p-1")

                        // * UV index color
                        // uvi <= 3 = fair
                        if (dailyuvi <= 3) { $(uvi).addClass("bg-green-400") }
                        // if uvi > 7 = severe
                        else if (dailyuvi >= 7) { $(uvi).addClass("bg-red-400") }
                        //else uvi is moderate
                        else { $(uvi).addClass("bg-yellow-400") }

                        //appends the p tags to the cards
                        $(this).append(feelslike).append(temp).append(wind).append(humid).append(uvi)

                    })

                    function currentWeatherBg() {
                        var currentWeather = oneCallData.daily[0].weather[0].main
                        $("#weather-cards-0").find("img").remove()
                        //removes back class after each search
                        $("#weather-cards-0").removeClass("background-rain text-white")
                        $("#weather-cards-0").removeClass("background-clear text-black")
                        $("#weather-cards-0").removeClass("background-cloud text-white")

                        if (currentWeather === `Clouds`) {

                            $("#weather-cards-0").addClass("background-cloud text-white")

                        } else if (currentWeather === `Rain`) {
                            $("#weather-cards-0").addClass("background-rain text-white")

                        } else {
                            $("#weather-cards-0").addClass("background-clear text-black")

                        }
                    }

                    currentWeatherBg()

                })
        })
}
// adds date to each card
$(".weather-cards").each(function () {

    let dayAsce = parseInt($(this).attr("data-day"))
    let date = $("<p>")
    date.text(`${month}/${day + dayAsce}/${year}`)
    $(date).addClass("text-center relative top-1 text-2xl m-1")
    $(this).append(date)

})

//prevents text and images from overlapping by removing elements after each search
function removelastsearch() {

    //if the p tags exist remove them
    $(".weather-cards").each(function () {


        const days = parseInt($(this).attr("data-day"))

        $("#weather-cards-" + days).find("#wind").remove()
        $("#weather-cards-" + days).find("#temp").remove()
        $("#weather-cards-" + days).find("#humid").remove()
        $("#weather-cards-" + days).find("#feeltemp").remove()
        $("#weather-cards-" + days).find("#UVI").remove()
        $("#weather-cards-" + days).find("img").remove()
        $("#weather-cards-" + days).removeClass("bg-gradient-to-b from-gray-200 to-blue-200");
        $("#weather-cards-" + days).removeClass("bg-gradient-to-b from-gray-100 to-gray-400");
        $("#weather-cards-" + days).removeClass("bg-gradient-to-b from-gray-200 to-yellow-100");

    })

}
//TODO recent searches
function RecentSearches() {
    if (JSON.parse(localStorage.getItem("cities")) !== null) {
        uniqueCities = JSON.parse(localStorage.getItem("cities"))

        // when a city is searched create a button of that city


        // add cities to recent searches
        for (let i = 0; i < uniqueCities.length; i++) {

            let recentBtn = $("<button>")

            $(recentBtn).text(uniqueCities[i])
            $(recentBtn).attr("type", "submit")
            $(recentBtn).attr("data-btnNum", i)
            $(recentBtn).attr("id", `btnNum-` + i)
            $(recentBtn).addClass(" flex-auto border border-gray-400 bg-gray-200 text-gray-700 rounded-md py-2 my-3 w-full transition duration-500 ease select-none hover:bg-gray-300 recent-btn ")
            $("#recent-flexbox").append(recentBtn)
        }



    }
    // store the cities into local storage
    // remove the last item from recent searches once it's full
}

$("#recent-form").on("click", function (e) {
    e.preventDefault()
    const target = e.target;
    if (!target.matches("button")) return;

    $(".recent-btn").each(function () {
        let btnNum = $(this).attr("data-btnNum")

        if (target.matches("#btnNum-" + btnNum)) {

            forecastparams.q = $("#btnNum-" + btnNum).text()


            $("#currentWeather").text(`Current Weather: ${forecastparams.q}`)
            weatherSearch()
            removelastsearch()
        }




    })


    //Retrieve the city name from the input
    // fetch weather data
    // populate our weather details
});





RecentSearches()