const BASE_URL = 'https://wttr.in/'; // Forgot to add https:// at first

/**
 * 
 * @param {string} location The location of the requested weather data.
 */
async function getLocationData (location = '1') {
    let url = BASE_URL + location + "?format=j1";

    console.log('Fetching ' + url);

    let api = await fetch(url)
    .then(response => response.json()
    .then(data => data)
    .catch(error => error));

    console.log('Returned ', api);

    return api;
}

// Main Input
let weatherForm = document.getElementsByClassName('weather-form')[0];
let weatherInput = weatherForm.querySelector('input');
// .weatherBody
let weatherBody = document.getElementsByClassName('weather-body')[0];
let defaultMsg = document.getElementById('default-main-message');
let title = weatherBody.querySelector('h1');
let bodyList = weatherBody.querySelectorAll('li');
let weatherGraphic = weatherBody.querySelector('.giphy-embed');
let weatherLink = document.querySelector('#giphy-link');
// .forecast
let forecastSection = document.getElementsByClassName('forecast')[0];
let forecastList = forecastSection.querySelectorAll('section');
// .previous-searches
let previousSearches = document.querySelector('.previous-searches');
let previousDefaultMsg = previousSearches.querySelector('h4');
let previousUnorderedList = previousSearches.querySelector('ul');
let previousStringList = [];

async function displayWeatherData(location) {
    // Sets the page back to default to let the user know it's being reloaded
    defaultMsg.style.display = '';
    weatherBody.style.display = 'none';
    forecastSection.style.display = 'none';

    // Settings up our API data
    console.log(arguments[0]);
    let data = await getLocationData(location);

    if(data.weather) {
        let currentCondition = data.current_condition[0];
        let nearestArea = data.nearest_area[0];
        let forecastData = data.weather;
        let hourlyWeather = forecastData[0].hourly[0];
    
        // Displays data for the .weather-body area
        title.innerHTML = nearestArea.areaName[0].value;
    
        bodyList[0].innerHTML = `<b>Area:</b> ${nearestArea.areaName[0].value}`;
        bodyList[1].innerHTML = `<b>Region:</b> ${nearestArea.region[0].value}`;
        bodyList[2].innerHTML = `<b>Country:</b> ${nearestArea.country[0].value}`;
        bodyList[3].innerHTML = `<b>Currently:</b> Feels Like ${currentCondition.FeelsLikeF}°F`;
        bodyList[4].innerHTML = `<b>Chance of Sunshine:</b> ${hourlyWeather.chanceofsunshine}%`;
        bodyList[5].innerHTML = `<b>Chance of Rain:</b> ${hourlyWeather.chanceofrain}%`;
        bodyList[6].innerHTML = `<b>Chance of Snow:</b> ${hourlyWeather.chanceofsnow}%`;

        let weatherDesc = hourlyWeather.weatherDesc[0].value;

        if(weatherDesc.includes('fog') 
        || weatherDesc.includes('mist') 
        || weatherDesc.includes('cloud')) {
            weatherGraphic.src = "https://giphy.com/embed/daO222fazggK5NGgKM";
            weatherLink.href = "https://giphy.com/stickers/happy-kawaii-moodoodles-daO222fazggK5NGgKM";
        }
        else if(weatherDesc.includes('storm')) {
            weatherGraphic.src = "https://giphy.com/embed/uvuZo0g1JbjusMij23";
            weatherLink.href = "https://giphy.com/stickers/cloud-storm-nuage-uvuZo0g1JbjusMij23";
        }
        else if(weatherDesc.includes('rain')) {
            weatherGraphic.src = "https://giphy.com/embed/qy5bxOA9ikILH3jKYV";
            weatherLink.href = "https://giphy.com/stickers/rain-cloud-raincloud-qy5bxOA9ikILH3jKYV";
        }
        else if(weatherDesc.includes('snow') || weatherDesc.includes('ice')) {
            weatherGraphic.src = "https://giphy.com/embed/PtgBUWepLWMHqGsApe";
            weatherLink.href = "https://giphy.com/stickers/snow-snowflake-neige-PtgBUWepLWMHqGsApe";
        }
        else {
            weatherGraphic.src = "https://giphy.com/embed/BCgbjF9Y41UgGEam5O";
            weatherLink.href = "https://giphy.com/stickers/encontrinhoblogdomath-BCgbjF9Y41UgGEam5O";
        }

        defaultMsg.style.display = 'none';
        weatherBody.style.display = '';
    
        // Displays data for the .forecast area
        for(var i = 0; i < forecastList.length; i++) {
            let dataElement = forecastData[i];
            let element = forecastList[i];
            let tempList = element.querySelectorAll('li');
    
            tempList[0].innerHTML = `Average Temperature: ${dataElement.avgtempF}°F`;
            tempList[1].innerHTML = `Max Temperature: ${dataElement.maxtempF}°F`;
            tempList[2].innerHTML = `Min Temperature: ${dataElement.mintempF}°F`;
        }
    
        forecastSection.style.display = '';

        // Adds this search to the previous searches list
        if(location.trim() && !previousStringList.includes(location)){
            previousDefaultMsg.style.display = 'none';
            generatePreviousSearch(location);
        }
    } else {
        window.alert('Something went wrong, please try again later...');
    }
}

/**
 * 
 * @param {string} target The location to be added to the previous searches list.
 */
function generatePreviousSearch(target) {
    let previous = document.createElement('li');
    previous.innerHTML = target;

    previousStringList.push(target);
    previousUnorderedList.append(previous);

    previous.addEventListener('click', () => {
        displayWeatherData(target);
    });

    console.log(previousStringList);
}

weatherForm.onsubmit = (event) => {
    event.preventDefault();
    displayWeatherData(weatherInput.value);
}