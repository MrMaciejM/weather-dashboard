//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");
var citiesList = document.getElementById("locationList");
var savedCitiesButtons = document.getElementsByClassName("savedCities");

var getLocalStorage = JSON.parse(localStorage.getItem("cities"));
var array = [];

// sets up local storage
if (getLocalStorage == null || getLocalStorage.length == 0) {
  localStorage.setItem("cities", JSON.stringify(array));
}

var apiKey = "7790a821eef7813b147ba03c132c329b";
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`;
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`;
var iconURL = "https://openweathermap.org/img/w/";

function getFormInput() {
  $(searchForm).on("submit", (event) => {
    event.preventDefault();
    var cityName = searchInput.value;
    //console.log("getForm ran");
    displayCurrentWeather(cityName);
    saveAndShowCity();
    searchInput.value = "";
    showCity();
  });
}
getFormInput();

function cityFromSavedList() {
  $(citiesList).on("click", function (e) {
    var cityName = e.target.innerText;
    //console.log("citySavedList ran");
    displayCurrentWeather(cityName);
  });
}
cityFromSavedList();

function displayCurrentWeather(cityName) {
  //currentURL
  $.get(currentURL + `q=${cityName}`).then((city) => {
    var cityName = city.name;
    var temp = city.main.temp;
    var wind = city.wind.speed;
    var humidity = city.main.humidity;
    var currentTime = moment().format("DD/MM/YYYY");
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

    // 5 DAY FORECAST
    // 5-Day forecast - date, icon, temp, wind, humidity
    //         // prettier-ignore
    $.get(forecastURL + `lat=${lat}&lon=${lon}`).then(function (data) {
      // 12pm unix epoch timestamp = 1672056000
      pmTime = "12:00:00";
      cleanForecast(); // stops stacking of forecast cards

      for (var i = 0; i < data.list.length; i++) {
        var forecastDate = data.list[i].dt_txt.slice(0, 10);
        var forecastHour = data.list[i].dt_txt.slice(11, 19); // 15:00:00 (15 is just example)
        var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemp = data.list[i].main.temp;
        // (wind * 3.6).toFixed(2)
        var forecastWind = data.list[i].wind.speed.toFixed(2);
        var forecastHumidity = data.list[i].main.humidity;

        if (forecastHour == pmTime) {
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
          );
        }
      }
    });
  });
}

var getStorage = JSON.parse(localStorage.getItem("cities")) || []; //the "|| []" replaces possible null from localStorage with empty array
function saveAndShowCity() {
  var l = console.log;
  var searchValue = searchInput.value;
  //var searchValue = "tea";
  // prettier-ignore
  var formatWord = searchValue[0].toUpperCase() + searchValue.slice(1).toLowerCase();

  // indexOf returns the first index at which a given element can be found in the array, or -1 if it is not present
  if (getStorage.indexOf(formatWord) == -1) {
    getStorage.push(formatWord);
    localStorage.setItem("cities", JSON.stringify(getStorage));
  }
}

function showCity() {
  if (!getStorage.length == 0) {
    // clear paragraphs to stop duplicates
    $(".locationList").empty();

    // prettier-ignore
    $(getStorage).each(function (index) {
      $(".locationList").append(
        `<p class="savedCities">${getStorage[index]}</p>`
      )
    })
  }
}
showCity();

saveAndShowCity();

//clean forecast cards to prevent duplicates stacking up
function cleanForecast() {
  $(".wrapperForecast").empty();
}
