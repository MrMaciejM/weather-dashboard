// NOTE: use jQuery

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ? = parameter list

var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");

var apiKey = "7790a821eef7813b147ba03c132c329b";
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = "https://openweathermap.org/img/w/";

// get city coordinates
function getCurrentCast(cityName) {
  // prettier-ignore
  return $.get(currentURL + `q=${cityName}`)
}

function getInput() {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // prettier-ignore
    getCurrentCast(searchInput.value)
     .then(function (city) {
        //console.log(city); // display all objects 
        // <h4 id="currentHeader">London (14/09/2022) .png</h4>
        var cityName = city.name;
        var temp = city.main.temp; 
        var wind = city.wind.speed;
        var humidity = city.main.humidity; 
        var currentTime =  moment().format("DD/MM/YYYY");
        var currentIcon = iconURL + city.weather[0].icon + ".png";
        // convert m/s to KPH
        var windConverted = (wind * 3.6).toFixed(2); 

        // ALT + 0176 = ° (celsius)
        // prettier-ignore
        $("#today").html(`
        <h4>
        ${cityName} (${currentTime})
        <img src="${currentIcon}"/>        
        </h4>
        <p>Temp: ${Math.round(temp)}°C</p>
        <p>Wind: ${windConverted} km/h</p>
        <p>Humidity: ${humidity}%</p>        
        `)

        //$("#today").prepend(`<h4>${cityName} (${currentTime}) <img src="${currentIcon}"/></h4>`);
        // TO-DO: overwrite current city, to prevent stacking of h4 elements.
        //console.log(currentIcon)
        console.log(currentIcon)
     })
  });
}
getInput();

// display current weather on main dashboard

// get city, current date and icon

//getInput();
// ***************************
/*
$.get(currentURL + `q=${cityName}`)
   .then(function (currentData) {
    // shows current weather
    console.log(
        currentData         
    ) // currentData . coord: {lon: -0.1257, lat: 51.5085} */
