var thermostatID="uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC"

var nestURL="https://developer-api.nest.com"
var nestAuthToken="c.s7K5ndoFFMrwvCbFypU2U29sRxlTQZ4jSJTvWD6zHLOxuRJjznVkm38MJi204sQrJnFhvQn3pygTeoM8IFLpLZfQwSlXE47zzs6JrPzGHW3X4FRW0FqNlbOi9sUYeBfFMnLePx1Gjfqn8MgS"

var weatherURL="https://api.openweathermap.org/data/2.5/weather?"
var weatherKey="586717aa0716809b69e439ab59109b93"

//NEST thermostat API AJAX call 
$.ajax({
    url: `https://cors-escape.herokuapp.com/${nestURL}/?auth=${nestAuthToken}`,
    type: "GET",
    contentType: "application/json",
    }).then(function (response)
    {
        console.log(response)
        console.log(response.devices.thermostats.uks8vKYvLFpURdo8n8GzwpNxir2Vn9sC.ambient_temperature_c)
        console.log(thermostatID)

    })

//OpenWeather AJAX call
$.ajax({
    url: `${weatherURL}q=Toronto&appid=${weatherKey}`,
    type: "GET"
}).then(function (response)
{
    console.log(response)
    console.log(response.main.temp)
}
)
