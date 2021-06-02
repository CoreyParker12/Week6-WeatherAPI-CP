let apiKey = "5bf9c1a715803d8ecc4d803eb5d55d43";

let searchButton = $('#sidebar-button');
let searchInput = $('#sidebar-searchbar input');
let recentOutput = $('#recent-buttons');

let city = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let humidity = $('#humidity');
let uvIndex = $('#uv-index');


let recentCity = [];

function submit() {
  
  let cityVal = searchInput.val();

  recentCity.push(cityVal);

  localStorage.setItem('city', JSON.stringify(recentCity));

  let getCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + cityVal + "&appid=" + apiKey + "&units=imperial";

  runWeather(getCoords);
  showRecents();

}

function previousCity() {
  let lastCity = JSON.parse(localStorage.getItem('city'));
  if (lastCity !== null) {
      recentCity = lastCity;
  }
}

function showRecents() {

  recentOutput.empty();

  for (let i = 0; i < recentCity.length; i++) {

    let showRecents = recentCity[i];

    let createButton = $('<button>').text(showRecents);
    recentOutput.prepend(createButton);
  }


}

(searchButton).click(function(event) {
  
  event.preventDefault();
  submit();
  previousCity();

});









function runWeather(getCoords) {

  fetch(getCoords)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

     let long = data.coord.lon;
     let lat = data.coord.lat;

     city.text(data.name);

     let getWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
     console.log(getWeather);
     
     fetch(getWeather)
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {
     
       temp.text(data.current.temp + '\u00B0' +'F');
       wind.text(data.current.wind_speed + ' MPH');
       humidity.text(data.current.humidity + '%');
       uvIndex.text(data.current.uvi);

       });

  });

}


function init() {
  previousCity();
  showRecents();
}
init();



