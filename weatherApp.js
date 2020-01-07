/*  The Goal

We wish to have our user type in a location, either by name, zip code, or by lat/long. Once they do we wish to show them nicely formatted Current Weather Data, an Hourly forecast for the next few days, and as a bonus, a few maps (for example: precipitation intensity, accumulated precipitation, or air temperature).

Use Radio Buttons in your search form to specifiy name, zip code, or lat/long. Also use Radio Buttons to toggle between maps.

Create an interface, get the data from the API, and build out the results. The styling and layout are up to you. The goal is to make it pleasant to use, and easy to read out the results.
*/

//Setup initial screen objects
// Location type selector
let locationType = document.querySelector("#locationType");
var locType = 1;
locationType.addEventListener('click', function(event) {
  //Read location radio button
  locType = event.target.value;
  console.log("Location type is:",locType);
})
// "Location" input
const inputLocation = document.querySelector('input[name="location"]');

queryObj = {
  locationName: '',
  zipCode: '',
  latitude: '',
  longitude: ''
}

// "Results" output
const resultsEl = document.querySelector('#main-content');
let forcastObj = {
  dateTime: '',
  temp: 0
}
let outputObj = {
  location: '',
  forcastObj: []
};

function kelvinToF (kelvin) {
  // Celsius is 273 degrees less than Kelvin
  const celsius = kelvin - 273;

  // Calculating Fahrenheit temperature to the nearest integer
  let fahrenheit = Math.floor(celsius * (9/5) + 32);

  // Displaying the temperature using string interpolation
  /*console.log(`The temperature is ${fahrenheit} degrees fahrenheit.`);*/
  return fahrenheit;
}

async function getData(location) {
  console.log('Location:', location);
  // validate location data
  if( !location ) {
    resultsEl.innerHTML = "Invalid Location";
    return null;
  }
  const cityAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=0cbdf65f217c07539831e5a8ecefa78b`

  const zipAPI = `https://api.openweathermap.org/data/2.5/forecast?zip=${location},us&APPID=0cbdf65f217c07539831e5a8ecefa78b`

  const latLongAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=33.8358&lon=-118.3407&APPID=0cbdf65f217c07539831e5a8ecefa78b`

  let weatherAPI = latLongAPI;

  console.log("Location type is:", locType);
  console.log(typeof(locType));
  switch (locType) {
    case '1': weatherAPI = cityAPI; break;
    case '2': weatherAPI = zipAPI; break;
    case '3': weatherAPI = latLongAPI; break;
    default: weatherAPI = latLongAPI;
  }
  console.log(weatherAPI);
  try {
    const response = await fetch(weatherAPI);
    const data = await response.json();
    console.log(data);
    outputObj.location = location;
    let html = `<h2>Forcast for ${outputObj.location}:</h2>`;
    for( i = 0; i < data.list.length; i++) {
      forcastObj.dateTime = data.list[i].dt_txt;
      forcastObj.temp = kelvinToF(data.list[i].main.temp);

      html += `<div class="card">
                <li>${forcastObj.dateTime}: ${forcastObj.temp}</li>
                <\div>`;
    }
    console.log(html)
    resultsEl.innerHTML = html;
    return outputObj;
  } catch (ex) {
    console.log(ex);
  }
}

async function locationSelected(event) {
  console.log("locationSelected");
    event.preventDefault();
    outputObj = await getData( inputLocation.value );
}

function mapSelectedEvent() {
}

//main
// "Submit button"
let buttonEl = document.querySelector('.btn-submit');
buttonEl.addEventListener('click', locationSelected);

