var thermostat = 
{
    ID: "uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC",
    currentTemp: 0,
    targetTemp: 0,
    tempArray:[],
    humidity: 0
}

var weather =
{
    currentTemp: 0,
    humidity: 0,
    windSpeed:0,
    windDirection:0,
    mainDescription: "",
    detailedDescription: ""
}

var user =
{
    name: "",
    location: ""
}

user.location="Toronto"

var nestURL="https://developer-api.nest.com"
var nestAuthToken="c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"

var weatherURL="https://api.openweathermap.org/data/2.5/weather?"
var weatherKey="586717aa0716809b69e439ab59109b93"

thermostat.tempArray=[]
//draw thermostat temp table
function drawThermostatData(){
    console.log("drawThermostat")
    //$("#ambientTemp").text("")
    $("#ambientTemp").text(`Indoor Temperature:${thermostat.currentTemp}`)
    $("#targetTemp").text(`Target Temperature${thermostat.targetTemp}`)
    $("#humidity").text(`Indoor Humidity: ${thermostat.humidity}`)
    }

function drawWeatherData(){

    $("#temp-detail").text("")
    $("#temp-detail").append(`${weather.mainDescription} - `)
    $("#temp-detail").append(`${weather.detailedDescription}<br>`)
    $("#temp-detail").append(`Outdoor Temperature: ${weather.currentTemp}<br>`)
    $("#temp-detail").append(`Outdoor Humidity: ${weather.humidity}<br>`)
    $("#temp-detail").append(`Air Pressure: ${weather.airPressure} mbar<br>`)
    $("#temp-detail").append(`Wind Speed: ${weather.windSpeed}kts`)
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

database.ref().on("child_added", function(childSnapshot) {
    thermostat.tempArray.push(childSnapshot.val().targetTemp)
    console.log(thermostat.tempArray)
})
//NEST thermostat API AJAX call 
var NESTPollInterval = setInterval(NESTPoll(), 1000*60*5)

//OpenWeather AJAX call
function weatherPoll(){
    $.ajax({
        url: `${weatherURL}q=${user.location}&appid=${weatherKey}`,
        type: "GET"
    }).then(function (response)
    {
        console.log(response)
        weather.currentTemp=Math.floor(response.main.temp-273)
        weather.humidity=response.main.humidity
        weather.airPressure=response.main.pressure
        weather.windSpeed=response.wind.speed
        weather.windDirection=response.wind.direction
        weather.mainDescription=response.weather[0].main
        weather.detailedDescription=response.weather[0].description
        drawWeatherData()
    })
    }

function NESTPoll(){
$.ajax({
    url: `https://cors-escape.herokuapp.com/${nestURL}/?auth=${nestAuthToken}`,
    type: "GET",
    contentType: "application/json",
    }).then(function (response)
    {
        thermostat.currentTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.ambient_temperature_c;
        thermostat.targetTemp=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.target_temperature_c
        thermostat.humidity=response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.humidity
        drawThermostatData()
        weatherPoll()
        console.log(thermostat.currentTemp, thermostat.targetTemp)
    
    console.log(thermostat.currentTemp, thermostat.targetTemp)
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




function getLocation() {
    var x = document.getElementById("mySelect").value;
    console.log(x)
    document.getElementById("location").innerHTML = "You selected: " + x;
   }

NESTPoll();
weatherPoll();

$("#user-location").text(user.location)

//thermostat up
$("#tempUp").on("click", function(){
    thermostat.targetTemp+=0.5;
    drawThermostatData();
    $.ajax({
        url: `https://cors-escape.herokuapp.com/${nestURL}/devices/thermostats/uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC`,
        type: "PUT",
        contentType: "application/json",
        headers: {"Authorization": "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"},
        data: JSON.stringify({"target_temperature_c": thermostat.targetTemp}),
        }).then(function ()
        {
            //drawThermostatData()
        })
})

$("#tempDown").on("click", function(){
    thermostat.targetTemp-=0.5;
    drawThermostatData();
    $.ajax({
        url: `https://cors-escape.herokuapp.com/${nestURL}/devices/thermostats/uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC`,
        type: "PUT",
        contentType: "application/json",
        headers: {"Authorization": "Bearer c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"},
        data: JSON.stringify({"target_temperature_c": thermostat.targetTemp}),
        }).then(function ()
        {
            //drawThermostatData()
        })
})

//draw chart
//var ctx = document.getElementById("tempChart").getContext('2d');
var ctx = $("#tempChart");
var myChart = new Chart(ctx, {
   type: 'bar',
   data: {
       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
       datasets: [{
           label: '# of Votes',
           data: thermostat.tempArray,
           backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)'
           ],
           borderColor: [
               'rgba(255,99,132,1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)'
           ],
           borderWidth: 1
       }]
   },
   options: {
       scales: {
           yAxes: [{
               ticks: {
                   beginAtZero:true
               }
           }]
       }
   }
});
