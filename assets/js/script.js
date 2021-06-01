let apiKey = "5bf9c1a715803d8ecc4d803eb5d55d43";
let cityX = 'Atlanta';



let getCoords = "http://api.openweathermap.org/data/2.5/weather?q=" + cityX + "&appid=" + apiKey + "&units=imperial";



console.log(getCoords);

let city = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let humidity = $('#humidity');
let uvIndex = $('#uv-index');


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



