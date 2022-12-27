// NOTE: use jQuery

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ? = parameter list

var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");
var citiesList = document.getElementById("locationList");

var apiKey = "7790a821eef7813b147ba03c132c329b";
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = "https://openweathermap.org/img/w/";
// get city coordinates
function getCurrentCast(cityName) {
  // prettier-ignore
  return $.get(currentURL + `q=${cityName}`);
}

function getInput() {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // prettier-ignore
    getCurrentCast(searchInput.value)
     .then(function (city) {        
        var cityName = city.name;
        var temp = city.main.temp; 
        var wind = city.wind.speed;
        var humidity = city.main.humidity; 
        var currentTime =  moment().format("DD/MM/YYYY");
        var currentIcon = iconURL + city.weather[0].icon + ".png";
        // convert m/s to km/h *NOTE: OBSOLETE, NO LONGER USED.
        // var windConverted = (wind * 3.6).toFixed(2);
        var lat = city.coord.lat;
        var lon = city.coord.lon;
  
        // ALT + 0176 = ° (celsius)        
        // main dashboard
        // prettier-ignore
        $("#today").html(`
        <h4>
        ${cityName} (${currentTime})
        <img src="${currentIcon}"/>        
        </h4>
        <p>Temp: ${Math.round(temp)}°C</p>
        <p>Wind: ${wind} KPH</p>
        <p>Humidity: ${humidity}%</p>        
        `)
        // <p>Wind: ${windConverted} km/h</p>
        // 5-Day forecast - date, icon, temp, wind, humidity
        //date: list.dt_txt "2022-12-25 00:00:00"
        //icon: list.weather.[].icon
        //temp: list.main.temp
        //wind: list.wind.speed
        //humidity: list.main.humidity
        // prettier-ignore
        $.get(forecastURL + `lat=${lat}&lon=${lon}`)  
          .then(function (data) {
              // 12pm unix epoch timestamp = 1672056000
            pmTime = "12:00:00"; 
            cleanForecast(); // stops stacking of forecast cards

            for(var i = 0; i < data.list.length; i++){
              var forecastDate = data.list[i].dt_txt.slice(0, 10);
              var forecastHour = data.list[i].dt_txt.slice(11, 19); // 15:00:00 (15 is just example)
              var forecastIcon = data.list[i].weather[0].icon;
              var forecastTemp = data.list[i].main.temp;
              // (wind * 3.6).toFixed(2)
              var forecastWind = (data.list[i].wind.speed).toFixed(2); 
              var forecastHumidity = data.list[i].main.humidity;

              if(forecastHour == pmTime) {
                $(".wrapperForecast").append(
                 `
                 <div class="forecastDays">
                     <p>${forecastDate}</p>
                     <img
                     src="https://openweathermap.org/img/w/${forecastIcon}.png"
                     alt="test"
                     />
                     <p>Temp: ${Math.round(forecastTemp)} °C</p>
                     <p>Wind: ${forecastWind} KPH</p>
                     <p>Humidity: ${forecastHumidity}%</p>
                 </div> 
                 `                 
                 )
              }                
            }
            console.log(data);            
          })            
     })
  });
}
getInput();

//clean forecast cards to prevent duplicates stacking up
function cleanForecast() {
  $(".wrapperForecast").empty();
}

// display previously typed cities (localStorage)
// set = stringify
// get = parse

// TO-DO:
// - display things from localStorage
// - add event listeners to each displayed item
// - make displayed item fill inputValue
// -
// <p>Madrid</p>
var array = [
  {
    cities: ["Madrid", "London"],
  },
];
var setStorage = localStorage.setItem("cities", JSON.stringify(array));
var getStorage = JSON.parse(localStorage.getItem("cities"));

function displayCities() {
  //
  for (var i = 0; i <= array.length; i++) {
    // prettier-ignore
    $(".locationList").append(
      `<p>${getStorage[0].cities[i]}</p>`
    )
    //console.log(getStorage[0].cities[i]);
  }

  $(citiesList).on("click", function (event) {
    //
    var savedCityName = event.target.textContent;
    console.log(savedCityName);
  });
  //
  //
}
displayCities();

// send displayed city into input

//console.log(getStorage);
