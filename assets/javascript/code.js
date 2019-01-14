var thermostat =
{
    ID: "uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC",
    currentTemp: 0,
    targetTemp: 0,
    tempArray: [],
    humidity: 0
}

var weather =
{
    currentTemp: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0,
    mainDescription: "",
    detailedDescription: "",
    tempArray: []
}

var user =
{
    name: "",
    location: "Toronto"
}


var nestURL = "https://developer-api.nest.com"
var nestAuthToken = "c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?"
var weatherKey = "586717aa0716809b69e439ab59109b93"

var chartTestArray = [1, 4, 3, 2, 5, 6,]

thermostat.tempArray = [] //this is for the chart of historical internal temperatures

//draw thermostat temp table
function drawThermostatData() {
    //$("#ambientTemp").text("")
    $("#ambientTemp").text(`Indoor Temperature:${thermostat.currentTemp}`)
    $("#targetTemp").text(`Target Temperature: ${thermostat.targetTemp}`)
    $("#humidity").text(`Indoor Humidity: ${thermostat.humidity}`)
    $("#thermostatDisplay").text(`${thermostat.currentTemp}`)
}

function drawWeatherData() {

    $("#temp-detail").text("")
    $("#user-location").text(user.location)
    $("#temp-detail").append(`${weather.mainDescription} - `)
    $("#temp-detail").append(`${weather.detailedDescription}<br>`)
    $("#temp-detail").append(`Outdoor Temperature: ${weather.currentTemp}<br>`)
    $("#temp-detail").append(`Outdoor Humidity: ${weather.humidity}<br>`)
    $("#temp-detail").append(`Air Pressure: ${weather.airPressure} mbar<br>`)
    $("#temp-detail").append(`Wind Speed: ${weather.windSpeed}kts`)
}

// Initialize Firebase
var config =
{
    apiKey: "AIzaSyD-1lvilaBOjUOmyT4fJBCRg0vNSuipck8",
    authDomain: "signup-f7ab6.firebaseapp.com",
    databaseURL: "https://signup-f7ab6.firebaseio.com",
    projectId: "signup-f7ab6",
    storageBucket: "signup-f7ab6.appspot.com",
    messagingSenderId: "252779509332"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function (childSnapshot) {
    thermostat.tempArray.push(childSnapshot.val().targetTemp)
    weather.tempArray.push(childSnapshot.val().outdoorTemp)
    drawIndoorTemperatureChart()
    drawOutdoorTemperatureChart()
})
//NEST thermostat API AJAX call 
var NESTPollInterval = setInterval(NESTPoll(), 1000 * 60 * 5)
var WeatherPollInterval = setInterval(weatherPoll(), 1000 * 60 *5)

//OpenWeather AJAX call
function weatherPoll() {
    $.ajax({
        url: `${weatherURL}q=${user.location}&appid=${weatherKey}`,
        type: "GET"
    }).then(function (response) {
        console.log(response)
        weather.currentTemp = Math.floor(response.main.temp - 273)
        weather.humidity = response.main.humidity
        weather.airPressure = response.main.pressure
        weather.windSpeed = response.wind.speed
        weather.windDirection = response.wind.direction
        weather.mainDescription = response.weather[0].main
        weather.detailedDescription = response.weather[0].description
        drawWeatherData()
    })
}

function NESTPoll() {
    $.ajax({
        url: `https://cors-escape.herokuapp.com/${nestURL}/?auth=${nestAuthToken}`,
        type: "GET",
        contentType: "application/json",
    }).then(function (response) {
        thermostat.currentTemp = response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.ambient_temperature_c;
        thermostat.targetTemp = response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.target_temperature_c
        thermostat.humidity = response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.humidity
        drawThermostatData()
        weatherPoll()

        database.ref().push({
            currentTemp: thermostat.currentTemp,
            targetTemp: thermostat.targetTemp,
            humidity: thermostat.humidity,
            outdoorTemp: weather.currentTemp,
            outdoorHumidity: weather.humidity,
            //windSpeed: weather.windSpeed,
            //airPressure: weather.airPressure
        })
    })
}


NESTPoll();
weatherPoll();



//thermostat up
$("#tempUp").on("click", function () 
{
    if(thermostat.targetTemp < 32)
    {
    thermostat.targetTemp += 0.5;
    drawThermostatData();
    $.ajax(
        {
        url: `https://cors-escape.herokuapp.com/${nestURL}/devices/thermostats/uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC`,
        type: "PUT",
        contentType: "application/json",
        headers: { "Authorization": "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS" },
        data: JSON.stringify({ "target_temperature_c": thermostat.targetTemp }),
        }).then(function () 
        {
        //drawThermostatData()
        })
    }
})

$("#tempDown").on("click", function () {
    if (thermostat.targetTemp > 9) {
        thermostat.targetTemp -= 0.5;
        drawThermostatData();
        $.ajax(
            {
                url: `https://cors-escape.herokuapp.com/${nestURL}/devices/thermostats/uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC`,
                type: "PUT",
                contentType: "application/json",
                headers: { "Authorization": "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS" },
                data: JSON.stringify({ "target_temperature_c": thermostat.targetTemp }),
            }).then(function () {
                //drawThermostatData()
            })
        }
    })

function drawIndoorTemperatureChart() {
    //draw chart
    //var ctx = document.getElementById("tempChart").getContext('2d');
    var ctx = $("#tempChart");
    //var chartArray = thermostat.tempArray.slice(thermostat.tempArray.length - 6, thermostat.tempArray.length)
    //console.log(thermostat.tempArray.slice(0,5))
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'thermostat target history:',
                data: thermostat.tempArray.slice(thermostat.tempArray.length - 6, thermostat.tempArray.length),
                //thermostat.tempArray.slice(0,1,2,3,4,5),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                scaleStepWidth: 1,
                //scaleSteps: 6,
                scaleOverride: true,

                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    });
}

function drawOutdoorTemperatureChart() {
    console.log(weather.tempArray.slice(weather.tempArray.length - 100, weather.tempArray.length))
    //draw chart
    var ctx = $("#outdoorTempChart");
    //var chartArray = weather.tempArray.slice(weather.tempArray.length - 6, weather.tempArray.length)
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'outdoor temperature history:',
                data: weather.tempArray.slice(weather.tempArray.length - 6, weather.tempArray.length),
                backgroundColor: [
                    'rgba(65,105,225, 0.2)'
                ],
                borderColor: [
                    'rgba(0,0,255,1)'
                ],
                borderWidth: 1,
                pointColor : 'rgba(0,0,0,1)',
                pointStrokeColor : '#fff',
            }]
        },
        options: {
            scales: {
                scaleStepWidth: 1,
                scaleSteps: 6,
                scaleOverride: true,

                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    });
}

$("#searchButton").on("click", function () {
    event.preventDefault();
    user.location = $("#location-search").val().trim().toLowerCase()
    $("#location-search").text("")
    $("#user-location").text(user.location)
    $("#location-search").val("")
    weatherPoll()
    NESTPoll()
})