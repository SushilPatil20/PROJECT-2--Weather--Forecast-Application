
const weatherDemonstration = document.getElementById('wetherDataDemonstration');
const forcastHolder = document.getElementById('fiveDaysForcast');
const API_key = `1b07387d9e8dc1ccc89c3cf8fce4b121`;
getWeatherDataByCurrentLocation();


// -------------------------------------- Getting current location --------------------------------------

function getWeatherDataByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    }
    else {
        weatherDemonstration.innerHTML = "Geolocation is not supported for this browser.";
    }
};


// -------------------------------------- Getting latitude and Longitude of current location --------------------------------------

function getPosition(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    displayWeatherDataByCurrentLocation(latitude, longitude);
}


// -------------------------------------- Display weather data by users current location --------------------------------------

async function displayWeatherDataByCurrentLocation(latitude, longitude) {
    weatherDemonstration.innerHTML = '<p class="text-xl text-blue-900">Loading....</p>'

    const API_call = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`
    try {
        const response = await fetch(API_call)
        const data = await response.json();

        const weatherData = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];

            if (!weatherData[date]) {
                weatherData[date] = [];
            }

            const weatherInfo = {
                temperature: item.main.temp,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
                weatherDescription: item.weather[0].description,
                imageLink: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
            };
            weatherData[date].push(weatherInfo);
        });

        const todaysDate = Object.keys(weatherData).splice(0, 1)[0]

        // fetching a weather data of for today Date
        const todayWeatherData = weatherData[todaysDate][0];

        // Retriving weather data 
        const cityName = data.city.name
        const temperature = todayWeatherData.temperature
        const humidity = todayWeatherData.humidity
        const windSpeed = todayWeatherData.windSpeed
        const imageLink = todayWeatherData.imageLink


        weatherDemonstration.innerHTML = `<img src="${imageLink}" alt="weather-img" width="200" height="200" class="object-cover">
                                         <section class="text-white space-y-3 w-full text-center sm:text-left sm:ml-12">
                                                <h3 class="text-2xl font-semibold">${cityName} (${todaysDate})</h3>
                                                <p>Temperature : <span>${temperature} °C</p>
                                                <p>Wind : ${windSpeed} M/S</p>
                                                <p>Humidity : ${humidity}%</p>
                                         </section>`;


        // -------------------------------------- Fetching weather data of upcoming 5 days --------------------------------------
        const dates = Object.keys(weatherData).splice(1, 6)


        forcastHolder.innerHTML = " "

        dates.forEach(date => {
            const weatherDataHolder = document.createElement('section');
            weatherDataHolder.setAttribute('class', 'bg-blue-300 text-gray-700 space-y-3 rounded-md px-6 p-3 flex flex-col items-center sm:flex-row sm:space-x-12 md:flex-col md:mx-auto md:space-x-0 md:text-center shadow-md shadow-gray-800');


            const imageLink = weatherData[date][0].imageLink
            const temprature = weatherData[date][0].temperature
            const humidity = weatherData[date][0].humidity
            const windSpeed = weatherData[date][0].windSpeed


            weatherDataHolder.innerHTML = `<section class="space-y-4">
                                              <h3 class="text-xl font-semibold">${date}</h3>
                                              <img src="${imageLink}"
                                              alt="" width="100" height="100" class="object-cover">
                                           </section>
                                           <section class="space-y-2">
                                              <p>Temperature : <span>${temprature}°C</span></p>
                                              <p>Wind : <span>${windSpeed} M/C</span></p>
                                              <p>Humidity : <span>${humidity}%</span></p>
                                           </section>`
            forcastHolder.appendChild(weatherDataHolder)
        })
    }
    catch (error) {
        console.log(error)
    }
}




































// -------------------------------------- Showcasing errors of API --------------------------------------

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            weatherDemonstration.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            weatherDemonstration.innerHTML = "Location information is unavailable. Please Check your internet connection..";
            break;
        case error.TIMEOUT:
            weatherDemonstration.innerHTML = "The request to get user location timed out.";
            break
        case error.UNKNOWN_ERROR:
            weatherDemonstration.innerHTML = "An unknown error occurred.";
            break
    }
}












































// -------------------------------------- Search by city name --------------------------------------

async function searchCity() {
    const userInputCityName = document.getElementById('cityNameInput').value;
    weatherDemonstration.innerHTML = '<p class="text-xl text-blue-900">Loading....</p>'
    if (userInputCityName) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${userInputCityName}&appid=${API_key}&units=metric`);
        const data = await response.json();
        const weatherData = {}
        data.list.forEach((item) => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];

            if (!weatherData[date]) {
                weatherData[date] = []
            }

            const weatherInfo = {
                temperature: item.main.temp,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
                weatherDescription: item.weather[0].description,
                imageLink: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
            }

            weatherData[date].push(weatherInfo)
        })

        const todaysDate = Object.keys(weatherData).splice(0, 1)[0]


        const todaysWeatherData = weatherData[todaysDate][0]

        const cityName = data.city.name
        const temperature = todaysWeatherData.temperature
        const humidity = todaysWeatherData.humidity
        const imageLink = todaysWeatherData.imageLink
        const windSpeed = todaysWeatherData.windSpeed

        weatherDemonstration.innerHTML = `<img src="${imageLink}" alt="weather-img" width="200" height="200" class="object-cover">
                                              <section class="text-white space-y-3 w-full text-center sm:text-left sm:ml-12">
                                                 <h3 class="text-2xl font-semibold">${cityName} (${todaysDate})</h3>
                                                 <p>Temperature : <span>${temperature} °C</p>
                                                 <p>Wind : ${windSpeed} M/S</p>
                                                 <p>Humidity : ${humidity}%</p>
                                              </section>`







        const dates = Object.keys(weatherData).splice(1, 6)
        forcastHolder.innerHTML = " "

        dates.forEach(date => {
            const weatherDataHolder = document.createElement('section');
            weatherDataHolder.setAttribute('class', 'bg-blue-300 text-gray-700 space-y-3 rounded-md px-6 p-3 flex flex-col items-center sm:flex-row sm:space-x-12 md:flex-col md:mx-auto md:space-x-0 md:text-center shadow-md shadow-gray-800');


            const imageLink = weatherData[date][0].imageLink
            const temprature = weatherData[date][0].temperature
            const humidity = weatherData[date][0].humidity
            const windSpeed = weatherData[date][0].windSpeed


            weatherDataHolder.innerHTML = `<section class="space-y-4">
                                              <h3 class="text-xl font-semibold">${date}</h3>
                                              <img src="${imageLink}"
                                              alt="" width="100" height="100" class="object-cover">
                                           </section>
                                           <section class="space-y-2">
                                              <p>Temperature : <span>${temprature}°C</span></p>
                                              <p>Wind : <span>${windSpeed} M/C</span></p>
                                              <p>Humidity : <span>${humidity}%</span></p>
                                           </section>`
            forcastHolder.appendChild(weatherDataHolder)
        })


    }
    else {
        weatherDemonstration.textContent = 'City name is not provided';
    }
}




