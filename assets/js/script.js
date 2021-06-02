//Weather API Key
let apiKey = "5bf9c1a715803d8ecc4d803eb5d55d43";

// Sets up the sidebar buttons and inputs
let searchButton = $('#sidebar-button');
let userInputBox = $('#sidebar-searchbar input');
let savedCities = $('#recent-buttons');

// Sets up variables for the main dashboard
let city = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let humidity = $('#humidity');
let uvIndex = $('#uv-index');
let iconT = $('#iconT');

//Sets up variables for 5 day forecast
let dayOne = $('#dayOne');
let dayTwo = $('#dayTwo');
let dayThree = $('#dayThree');
let dayFour = $('#dayFour');
let dayFive = $('#dayFive');

let dayOneTemp = $('#dayOneTemp');
let dayTwoTemp = $('#dayTwoTemp');
let dayThreeTemp = $('#dayThreeTemp');
let dayFourTemp = $('#dayFourTemp');
let dayFiveTemp = $('#dayFiveTemp');

let dayOneHum = $('#dayOneHum');
let dayTwoHum = $('#dayTwoHum');
let dayThreeHum = $('#dayThreeHum');
let dayFourHum = $('#dayFourHum');
let dayFiveHum = $('#dayFiveHum');

let dayOneWind = $('#dayOneWind');
let dayTwoWind = $('#dayTwoWind');
let dayThreeWind = $('#dayThreeWind');
let dayFourWind = $('#dayFourWind');
let dayFiveWind = $('#dayFiveWind');

let dayOneIcon = $('#dayOneIcon');
let dayTwoIcon = $('#dayTwoIcon');
let dayThreeIcon = $('#dayThreeIcon');
let dayFourIcon = $('#dayFourIcon');
let dayFiveIcon = $('#dayFiveIcon');

// Sets empty arrays for future needed values
let dailyTemps = [];
let dailyWind = [];
let dailyHum = [];
let dailyIcon = [];
let dailyIconURL = [];
let recentCityArr = [];

// Moment JS variables
let todayDate = moment().format('L');
let dateOne = moment(todayDate,"L").add(1, "days").format("dddd");
let dateTwo = moment(todayDate,"L").add(2, "days").format("dddd");
let dateThree = moment(todayDate,"L").add(3, "days").format("dddd");
let dateFour = moment(todayDate,"L").add(4, "days").format("dddd");
let dateFive = moment(todayDate,"L").add(5, "days").format("dddd");

dayOne.html(dateOne);
dayTwo.html(dateTwo);
dayThree.html(dateThree);
dayFour.html(dateFour);
dayFive.html(dateFive);


// Function that triggers the click event to load weather data 
function submit() {
  
  let userInputCity = userInputBox.val();

  // Checks to see if the city has already been submitted previously
  // Gets lat and long based on user city input. getCoords url is passed down to runWeather as an input
  if ($.inArray(userInputCity, recentCityArr) < 0) {
    
    recentCityArr.push(userInputCity);
    localStorage.setItem('city', JSON.stringify(recentCityArr));
    let getCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputCity + "&appid=" + apiKey + "&units=imperial";
    runWeather(getCoords);
    displayRecentCities();

  } else {

    let getCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputCity + "&appid=" + apiKey + "&units=imperial";
    runWeather(getCoords);
    displayRecentCities();

  }
}

// After submit runs, function gets length of array and displays all saved cities
// A click event inside the functions allows you to select a previously searched city
// Automatically runs on page load
function displayRecentCities() {

  // Prevents double posting of saved cities list
  savedCities.empty();

  // Loops through the length of the cities array and creates new list buttons absed on its results
  for (let i = 0; i < recentCityArr.length; i++) {

    let showRecents = recentCityArr[i];

    let createButton = $('<button>').text(showRecents);

    // Allows the buttons to be clicked to load a previously searched city
    createButton.click(function() {

        userInputBox.val(showRecents);
        runWeather("https://api.openweathermap.org/data/2.5/weather?q=" + showRecents + "&appid=" + apiKey + "&units=imperial");

    });

    // Appends cities to list in reverse order
    savedCities.prepend(createButton);
  }
}

// Checks for saved cities and loads them from local storage
// Runs before the cities are displayed. Automatically runs on page load
function checkForSavedCities() {
    let lastCity = JSON.parse(localStorage.getItem('city'));
    if (lastCity !== null) {
        recentCityArr = lastCity;
    }
  }

// Click event to run needed functions when submit button is clicked
searchButton.click(function(event) {
  
  event.preventDefault();
  submit();
  checkForSavedCities();

});

// Takes in getCoords url and then calls the One Call API to retreive remaining information
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
     console.log(getWeather)
     
     fetch(getWeather)
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {

        // Icon display
        let iconToday = (data.daily[0].weather[0].icon)
        let iconURL = "https://openweathermap.org/img/wn/" + iconToday + ".png"
        iconT.attr('src', iconURL);
       
        // Weather condition display
        temp.text(data.current.temp + '\u00B0' +'F');
        wind.text(data.current.wind_speed + ' MPH');
        humidity.text(data.current.humidity + '%');
        uvIndex.text(data.current.uvi);

        if (uvIndex.text() < 4) {
            uvIndex.css('background-color', 'green');
            uvIndex.css('color', 'black');
        } else if (uvIndex.text() > 8) {
              uvIndex.css('background-color', 'red');
              uvIndex.css('color', 'black');
        } else {
              uvIndex.css('background-color', 'yellow');
              uvIndex.css('color', 'black');
              }

        // Loops through the 5 days and collects weather info from the API     
        for (let i = 0; i < 5; i++) {

            dailyTemps[i] = data.daily[i].temp.day;
            dailyHum[i] = data.daily[i].humidity;
            dailyWind[i] = data.daily[i].wind_speed;
            dailyIcon[i] = data.daily[i].weather[0].icon;
            dailyIconURL[i] = "https://openweathermap.org/img/wn/" + dailyIcon[i] + ".png"

            dayOneTemp.text(dailyTemps[0] + '\u00B0' +'F');
            dayTwoTemp.text(dailyTemps[1] + '\u00B0' +'F');
            dayThreeTemp.text(dailyTemps[2] + '\u00B0' +'F');
            dayFourTemp.text(dailyTemps[3] + '\u00B0' +'F');
            dayFiveTemp.text(dailyTemps[4] + '\u00B0' +'F');

            dayOneHum.text(dailyHum[0] + '%');
            dayTwoHum.text(dailyHum[1] + '%');
            dayThreeHum.text(dailyHum[2] + '%');
            dayFourHum.text(dailyHum[3] + '%');
            dayFiveHum.text(dailyHum[4] + '%');

            dayOneWind.text(dailyWind[0] + ' MPH');
            dayTwoWind.text(dailyWind[1] + ' MPH');
            dayThreeWind.text(dailyWind[2] + ' MPH');
            dayFourWind.text(dailyWind[3] + ' MPH');
            dayFiveWind.text(dailyWind[4] + ' MPH');

            dayOneIcon.attr('src', dailyIconURL[0]);
            dayTwoIcon.attr('src', dailyIconURL[1]);
            dayThreeIcon.attr('src', dailyIconURL[2]);
            dayFourIcon.attr('src', dailyIconURL[3]);
            dayFiveIcon.attr('src', dailyIconURL[4]);

        }
       });
  });
}

// Redundant function to automatically load the local city of Atlanta without input
function defaultCity() {
    
    let getCoords = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=" + apiKey + "&units=imperial";

    fetch(getCoords)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
  
       let long = data.coord.lon;
       let lat = data.coord.lat;
       city.text(data.name);
       let getWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
       
       fetch(getWeather)
       .then(function (response) {
         return response.json();
       })
       .then(function (data) {

          let icon = (data.daily[0].weather[0].icon)
          let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png"
          iconT.attr('src', iconURL);
        
          temp.text(data.current.temp + '\u00B0' +'F');
          wind.text(data.current.wind_speed + ' MPH');
          humidity.text(data.current.humidity + '%');
          uvIndex.text(data.current.uvi);

          if (uvIndex.text() < 4) {
              uvIndex.css('background-color', 'green');
              uvIndex.css('color', 'black');

          } else if (uvIndex.text() > 8) {
              uvIndex.css('background-color', 'red');
              uvIndex.css('color', 'black');
          } else {
                  uvIndex.css('background-color', 'yellow');
                  uvIndex.css('color', 'black');
              }

          for (let i = 0; i < 5; i++) {

              dailyTemps[i] = data.daily[i].temp.day;
              dailyHum[i] = data.daily[i].humidity;
              dailyWind[i] = data.daily[i].wind_speed;
              dailyIcon[i] = data.daily[i].weather[0].icon;
              dailyIconURL[i] = "https://openweathermap.org/img/wn/" + dailyIcon[i] + ".png"

              dayOneTemp.text(dailyTemps[0] + '\u00B0' +'F');
              dayTwoTemp.text(dailyTemps[1] + '\u00B0' +'F');
              dayThreeTemp.text(dailyTemps[2] + '\u00B0' +'F');
              dayFourTemp.text(dailyTemps[3] + '\u00B0' +'F');
              dayFiveTemp.text(dailyTemps[4] + '\u00B0' +'F');

              dayOneHum.text(dailyHum[0] + '%');
              dayTwoHum.text(dailyHum[1] + '%');
              dayThreeHum.text(dailyHum[2] + '%');
              dayFourHum.text(dailyHum[3] + '%');
              dayFiveHum.text(dailyHum[4] + '%');

              dayOneWind.text(dailyWind[0] + ' MPH');
              dayTwoWind.text(dailyWind[1] + ' MPH');
              dayThreeWind.text(dailyWind[2] + ' MPH');
              dayFourWind.text(dailyWind[3] + ' MPH');
              dayFiveWind.text(dailyWind[4] + ' MPH');

              dayOneIcon.attr('src', dailyIconURL[0]);
              dayTwoIcon.attr('src', dailyIconURL[1]);
              dayThreeIcon.attr('src', dailyIconURL[2]);
              dayFourIcon.attr('src', dailyIconURL[3]);
              dayFiveIcon.attr('src', dailyIconURL[4]);

          }  
         });
    });
}

// Functions to run on page load
function init() {
  defaultCity();
  checkForSavedCities();
  displayRecentCities();
}
init();