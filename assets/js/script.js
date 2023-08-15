var APIKey = "977e63b2d68c30cbf1c994dc6f863f73";
var city = document.getElementById('ctiyName');

// var lat = "";
// var lon = "";


var searchBtn = document.getElementById("searchBtn");

function getInputValue (){
    var inputVal = document.getElementById("searchInput").value;
    console.log(inputVal);
    return inputVal;
}

var responseText = document.getElementById('response-text');

function getWeather(requestWeather) {
  fetch(requestWeather)
    .then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        console.log(res.status, res.data)

    }));
  }

// getApi(requestWeather);

function getCoordinates(requestCoordinates) {
    fetch(requestCoordinates).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        console.log(res.status, res.data)
        if ( res.data[0] !== null ) {
            lat = res.data[0].lat;
            lon = res.data[0].lon;
            var requestWeather = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            getWeather(requestWeather);
        }

        return res.data[0];
    }));
  }

searchBtn.addEventListener('click', function () {
    city = getInputValue();
    var requestCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKey;
    if (city !== "" ) {
        getCoordinates(requestCoordinates);  
        // console.log(coordinates);

    }

});