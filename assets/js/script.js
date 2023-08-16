var APIKey = "977e63b2d68c30cbf1c994dc6f863f73";
var searchBtn = document.getElementById("searchBtn");

function getInputValue (){
    var inputVal = document.getElementById("searchCity").value;
    console.log(inputVal);
    return inputVal;
};

var responseText = document.getElementById("response-text");


function getCoordinates(requestCoordinates) {
    fetch(requestCoordinates).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        // console.log(res.status, res.data)
        if ( res.data[0] !== null ) {
            lat = res.data[0].lat;
            lon = res.data[0].lon;
            city = res.data[0].name;

            var requestWeather = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;
            currentWeather(requestWeather, lat, lon, city);
        }
    }));
  };

function currentWeather(requestWeather, lat, lon, city) {
    fetch(requestWeather)
    .then(response => response.json())
    .then(data => {
        var date = dayjs().format("M/D/YYYY")

        // Get required current weather elements to add text based on weather response
        var currentCity = document.getElementById("curCity");
        var currentTemp = document.getElementById("temp");
        var currentWindSpeed = document.getElementById("wind");
        var currentHumidity = document.getElementById("humidity");

        currentCity.style.display = "inline";
        currentCity.innerText = city + " " + date ;
    
        var iconCode = data.weather[0].icon;
        var parentElem = document.querySelector("#curCity");

        var icon = document.createElement("img");
        icon.setAttribute("src","https://openweathermap.org/img/wn/" + iconCode + "@2x.png");
        icon.setAttribute("display","inline");
        parentElem.insertBefore(icon, currentTemp.nextSibling);
    
        // Based on response, set innerText to corresponding data (temp, speed, humidity)
        currentTemp.innerText = "Temp: " + data.main.temp + " \xB0" + "F";
        currentWindSpeed.innerText = "Wind: " + data.wind.speed + " MPH";
        currentHumidity.innerText = "Humidity: " + data.main.humidity + "%";

        saveCity(city);
        // Get Forecast based on previous lat & lon
        var requestForecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + APIKey;
        get5DayForecast(requestForecast);
    });
  };

function get5DayForecast(requestForecast) {
    fetch(requestForecast)
      .then(response => response.json())
      .then(data => {
        var forecast = data.list;
        var weatherForecast = document.querySelector("#futureWeather");
        weatherForecast.innerHTML = "";

        var forecastSection = document.createElement("div");
        forecastSection.setAttribute("class", "col-sm-12");
        forecastSection.setAttribute("id", "forecastWeather");

        var sectionTitle = document.createElement("h3");
        sectionTitle.textContent = "5-Day Forecast:";
        forecastSection.appendChild(sectionTitle);

        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row text-light");

        for (var i = 0; i < forecast.length; i += 8) {
            var forecastDiv = document.createElement("div");
            forecastDiv.setAttribute("class", "col-sm-2 forecastDiv text-white ml-2 mb-3 p-2 mt-2 rounded");

            var date = document.createElement("p");
            date.setAttribute("id", "forecastDate");
            date.textContent = dayjs(forecast[i].dt_txt).format("MM/DD/YYYY");
            forecastDiv.appendChild(date);

            var icon = document.createElement("p");
            icon.setAttribute("id", "forecastImg");
            var iconImage = document.createElement("img");
            iconImage.setAttribute("src", "https://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + "@2x.png");
            icon.appendChild(iconImage);
            forecastDiv.appendChild(icon);

            var temp = document.createElement("p");
            temp.textContent = "Temp: ";
            var tempS = document.createElement("span");
            tempS.setAttribute("id", "forecastTemp");
            tempS.textContent = forecast[i].main.temp + " \xB0" + "F";
            temp.appendChild(tempS);
            forecastDiv.appendChild(temp);

            var wind = document.createElement("p");
            wind.textContent = "Wind: ";
            var windS = document.createElement("span");
            windS.setAttribute("id", "forecastWind");
            windS.textContent = forecast[i].wind.speed + " MPH";
            wind.appendChild(windS);
            forecastDiv.appendChild(wind);

            var humidity = document.createElement("p");
            humidity.textContent = "Humidity: ";
            var humidityS = document.createElement("span");
            humidityS.setAttribute("id", "forecastHumidity");
            humidityS.textContent = forecast[i].main.humidity + " %";
            humidity.appendChild(humidityS);
            forecastDiv.appendChild(humidity);

            rowDiv.appendChild(forecastDiv);
        }

        forecastSection.appendChild(rowDiv);
        weatherForecast.appendChild(forecastSection);
      });
};

  
function saveCity(newCity) {

  var savedCities = JSON.parse(localStorage.getItem("savedCityList")) || [];
  if(savedCities.includes(newCity)){
    return
  }
  savedCities.push(newCity);
  localStorage.setItem("savedCityList", JSON.stringify(savedCities));
  console.log(savedCities);
};

function cityList() {

    var savedCities = JSON.parse(localStorage.getItem("savedCityList")) || [];
  
    var savedCitiesContainer = document.getElementById("savedCities");
    savedCitiesContainer.innerHTML = "";

    savedCities.forEach(function (city) {
        var savedCitiesButton = document.createElement("button");
        savedCitiesButton.classList.add("savedCities-button");
        savedCitiesButton.textContent = city;
        savedCitiesButton.addEventListener("click", function () {
        var requestCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKey;
        if (city !== "") {
            getCoordinates(requestCoordinates);
        }
        });
        savedCitiesContainer.appendChild(savedCitiesButton);
    });
    };

searchBtn.addEventListener("click", function () {
    city = getInputValue();
    var requestCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKey;
    if (city !== "" ) {
        //getCoordinates -> getWeather -> get5DayForecast
        getCoordinates(requestCoordinates);  

        //Save & update city list
        saveCity(city);
        cityList();
    }

});

cityList();