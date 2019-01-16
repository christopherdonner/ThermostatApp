# Group 4: Project Title: Nest Thermostat

### Team Members:
- Christopher Donner [Chris' github](https://github.com/tiger2877)
- Pryambudhi Cahyadi [Budhi's github](https://github.com/christopherdonner/)

### Project Description
Weather forecast and indoor temperature control have been modernized for many years.
The Nest Thermostat is one of the most popular home thermostats on the market today, 
On our website, users will be able to enter their personal information and address on our website.
This data will be, then, stored in our Firebase.
From this user input data, users will be able to do the followings:
* display weather data based on user.location value
* display ambient temperature and target temperature from the NEST thermostat
* increment or decrement the thermostat target temperature. This must be bound by the actual thermostat limits of min=9 and max=32
* chart out the historic data we pull from firebase

- - -

### Overview
Here's what our program does:
* on load:
check local storage for user.location value
initialize firebase connection
set on child_added trigger for firebase
draw the chart as the firebase data is pushed to a local array
set 300 second polling interval for weather GET and nest GET
if 404 is returned from openweather API on the query call, return error
OpenWeather API returns temperature, wind speed, humidity, main description, sub description
NEST API Poll queries the thermostat for currentTemp and targetTemp and pushes all weather and thermostat data to firebase
Values obtained in the NEST and Weather polls are pushed to the HTML page using JQUERY
on click triggers created for thermostat up and down -> on click, local value is incremented and PUT request is sent to NEST API pushing local value to the thermostat
on click is created for the user's location -> on click pulls the value of the form, trims, sets to lower case and calls the weather poll function which will return a Not Found error if a 404 is returne

- - -

### Sketch of Final Product: 
![Nest Thermostat Project](snapshot.jpg)

- - -

### APIs to be Used:
    * openweather API
    * Nest API
    
 - - -  
    
### Rough Breakdown of Tasks:
* create the main html body
* create and test APIs
* send data from APIs to our Firebase
* retrieve data from our Firebase and display it on our website

- - -

### Feature requests:

In our program, we are hard coding the NEST auth token that was obtained via the ARC REST client. It would be nice to implement this within the product.
* Celsius vs farenheit selector was never coded.
* add weather forecasts (pulling from iterate through the nest response to pull all available devices and then store the device ID required. As it stands, this has been hardcoded based on the initial response.
* Show images (sun, cloud, snow, rain, etc) that display based on the weather main description that is returned
