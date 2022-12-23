// NOTE: use jQuery

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ? = parameter list

var apiKey = "7790a821eef7813b147ba03c132c329b";
var city = "London"; // users input
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = "https://openweathermap.org/img/w/";

// icon weather property - icon, e.g. icon: "50n"
function inputSubmitted(cityName) {
  // server side request
  // prettier-ignore
  $.get(currentURL + `q=${cityName}`)
   .then(function (currentData) {
    // shows current weather
    console.log(
        currentData         
    ) // currentData . coord: {lon: -0.1257, lat: 51.5085} 

    console.log(`
    Temp: ${Math.round(currentData.main.temp)}
    Humidity: ${currentData.main.humidity}%
    Wind: ${currentData.wind.speed}
    IconURL: ${iconURL + currentData.weather[0].icon}.png}
    `);

    // show 5 day forecast - you need to loop through only 5 
    $.get(forecastURL + `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`) 
    .then(function(forecastData) {
        for (var castObj of forecastData.list) {
            //console.log(`${iconURL + castObj.weather[0].icon}.png`)
        }
    //console.log(forecastData); 
    })
  });
}
inputSubmitted(city);
