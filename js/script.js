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
        // convert m/s to km/h
        var windConverted = (wind * 3.6).toFixed(2);
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
        <p>Wind: ${windConverted} km/h</p>
        <p>Humidity: ${humidity}%</p>        
        `)

        // 5-Day forecast - date, icon, temp, wind, humidity
        //date: list.dt_txt "2022-12-25 00:00:00"
        //icon: list.weather.[].icon
        //temp: list.main.temp
        //wind: list.wind.speed
        //humidity: list.main.humidity
        // prettier-ignore
        $.get(forecastURL + `lat=${lat}&lon=${lon}`)  
          .then(function (data) {

            for(var i = 0; i < 5; i++){
              // 12pm unix epoch timestamp = 1672052400
              var forecastDate = data.list[i].dt_txt.slice(0, 10);

              // if cnt/time greater than one date timestamp
              $(".wrapperForecast").append(
                `
                <div class="forecastDays">
                    <p>${forecastDate}</p>
                    <img
                    src="https://openweathermap.org/img/w/03d.png"
                    alt="test"
                    />
                    <p>Temp: 13.63 oC</p>
                    <p>Wind: 1.7 KPH</p>
                    <p>Humidity: 84%</p>
                </div> 
                `
              
                
              )
            }
            console.log(data);
            //console.log(lat);
            //console.log(lon);
          })      
        
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
