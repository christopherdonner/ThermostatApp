var thermostat = 
{
    ID: "uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC",
    currentTemp: 0,
    targetTemp: 0,
    humidity: 0
}

var weather =
{
    currentTemp: 0,
    humidity: 0,
    mainDescription: "",
    subDescription: "",
    windSpeed: 10,
    windDirection: 0,
    airPressue: 0,
} 

var user =
{
    name: "",
    location: ""
}
var userLocation="Toronto"

var nestURL="https://developer-api.nest.com"
var nestAuthToken="c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"

var weatherURL="https://api.openweathermap.org/data/2.5/weather?"
var weatherKey="586717aa0716809b69e439ab59109b93"

//draw thermostat temp table
function drawThermostatData(){
    $("#user-temp").text("")
    $("#user-temp").append(`Indoor Temperature:${thermostat.currentTemp}<br>`)
    $("#user-temp").append(`Target Temperature${thermostat.targetTemp}<br>`)
    $("#user-temp").append(`Indoor Humidity: ${thermostat.humidity}`)
    }

function drawWeatherData(){
    $("#temp-detail").text("")
    $("")
    $("#temp-detail").append(`<br>Outdoor Temperature: ${weather.currentTemp}<br>`)
    $("#temp-detail").append(`Outdoor Humidity: ${weather.humidity}`)
}



// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-1lvilaBOjUOmyT4fJBCRg0vNSuipck8",
    authDomain: "signup-f7ab6.firebaseapp.com",
    databaseURL: "https://signup-f7ab6.firebaseio.com",
    projectId: "signup-f7ab6",
    storageBucket: "signup-f7ab6.appspot.com",
    messagingSenderId: "252779509332"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//NEST thermostat API AJAX call 
var NESTGETInterval = setInterval(NESTGET(), 1000*60*5)

function dbPush(){
    database.ref().push({
        currentTemp: thermostat.currentTemp,
        targetTemp: thermostat.targetTemp,
        humidity: thermostat.humidity 
    })
}


function NESTGET(){
$.ajax({
    url: `https://cors-escape.herokuapp.com/${nestURL}/?auth=${nestAuthToken}`,
    type: "GET",
    contentType: "application/json",
    }).then(function (response)
    {
        console.log(response)
        thermostat.currentTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.ambient_temperature_c;
        thermostat.targetTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.target_temperature_c
        thermostat.humidity=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.humidity
        console.log(thermostat.currentTemp)
        console.log(thermostat.targetTemp)
        console.log(thermostat.humidity)
        drawThermostatData();
        dbPush();
    })

}

NESTGET();

//OpenWeather AJAX call
$.ajax({
    url: `${weatherURL}q=${userLocation}&appid=${weatherKey}`,
    type: "GET"
}).then(function (response)
{
    console.log(response)
    weather.currentTemp=Math.floor(response.main.temp-273)
    weather.humidity=response.main.humidity
    console.log(response.weather[0].description)
    weather.mainDescription=response.weather[0].main
    weather.subDescription=response.weather[0].description
    drawWeatherData()
})

$("#submitButton").on("click", function(){

    user.location=$("#location").val().trim()
})

//thermostat up
$("#thermostatUp").on("click", function(){
    $.ajax({
        url: `https://cors-escape.herokuapp.com/${nestURL}/devices/thermostats/uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC/?auth=${nestAuthToken}`,
        type: "PUT",
        contentType: "application/json",
        data: {"target_temperature_c": 25}
        }).then(function (response)
        {
            console.log(response)
            thermostat.currentTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.ambient_temperature_c;
            thermostat.targetTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.target_temperature_c
            thermostat.humidity=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.humidity
            console.log(thermostat.currentTemp)
            console.log(thermostat.targetTemp)
            console.log(thermostat.humidity)
            drawThermostatData()
        })
    
})