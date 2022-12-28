// weather app backup

// NOTE: use jQuery

//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// ? = parameter list

var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");
var citiesList = document.getElementById("locationList");
var array = [];
var getLocalStorage = JSON.parse(localStorage.getItem("cities"));
if (getLocalStorage == null || getLocalStorage.length == 0) {
  localStorage.setItem("cities", JSON.stringify(array));
}

var apiKey = "7790a821eef7813b147ba03c132c329b";
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = "https://openweathermap.org/img/w/";

// display refresh notification
function notifyRefresh() {
  var notify = document.querySelector(".notify");
  notify.setAttribute("class", "hide");
}
//notifyRefresh();

// get city coordinates
function getCurrentCast(cityName) {
  // prettier-ignore
  return $.get(currentURL + `q=${cityName}`);
}

function getInput() {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    notifyRefresh();
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

        // *****************
        // 5-Day forecast - date, icon, temp, wind, humidity
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
            //console.log(data);            
          })            
     })
    // save input to localStorage
    var searchValue = searchInput.value;
    var array2 = JSON.parse(localStorage.getItem("cities"));

    if (array2.length == 0) {
      array2.push(searchValue);
      localStorage.setItem("cities", JSON.stringify(array2));
    }

    for (var j = 0; j < array2.length; j++) {
      var getStorage = JSON.parse(localStorage.getItem("cities"));
      var array2 = getStorage;

      if (!array2.includes(searchValue)) {
        array2.push(searchValue);
        localStorage.setItem("cities", JSON.stringify(array2));
      }
    }
  });
}
getInput();

//clean forecast cards to prevent duplicates stacking up
function cleanForecast() {
  $(".wrapperForecast").empty();
}

// display saved cities
function displayCities() {
  var getStorage = JSON.parse(localStorage.getItem("cities"));

  if (getStorage.cities != 0) {
    for (var i = 0; i < getStorage.length; i++) {
      // prettier-ignore
      $(".locationList").append(
            `<p>${getStorage[i]}</p>`
            )
    }
  }
}
displayCities();

// display weather upon clicking a saved city
$(citiesList).on("click", function (event) {
  var savedCityName = event.target.textContent;
  notifyRefresh();

  // show main dashboard
  // prettier-ignore
  $.get(currentURL + `q=${savedCityName}`)
    .then( function (city){
        var cityName = city.name;
        var temp = city.main.temp; 
        var wind = city.wind.speed;
        var humidity = city.main.humidity; 
        var currentTime =  moment().format("DD/MM/YYYY");
        var currentIcon = iconURL + city.weather[0].icon + ".png";
        var lat = city.coord.lat;
        var lon = city.coord.lon;
  
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

        // 5 day forecast
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
          })  
    });
});
