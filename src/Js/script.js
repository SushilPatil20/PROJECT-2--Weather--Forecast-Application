
const weatherDemonstration = document.getElementById('wetherDataDemonstration');
const forcastHolder = document.getElementById('fiveDaysForcast');
const API_key = `1b07387d9e8dc1ccc89c3cf8fce4b121`;
getWeatherDataByCurrentLocation();
class LocalStorage {

    /**
     * 
     * Storing cityname in a localstorage
     * 
     * @param key 
     * @param value
     */

    static store(key = null, value = null) {
        localStorage.setItem(key, JSON.stringify(value))
    }


    /**
     * 
     * Reading cityname from localstorage
     * 
     * @param key 
     */
    static read(key = null) {
        const cityNamesArray = JSON.parse(localStorage.getItem(key));
        return cityNamesArray;
    }
}

let forcastHistory = LocalStorage.read('forcastHistory') || []



// -------------------------------------- Helpers --------------------------------------


// -------------------------------------- Displaying loading message --------------------------------------

function loading() {
    return '<p class="text-2xl text-blue-950">Loading....</p>';
}


// -------------------------------------- Fetch data by city name --------------------------------------

async function fetchByCityName(cityName = null) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_key}&units=metric`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error)
    }
}


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





// function displayForCastSearch() {
//     const forcastHistoryContainer = document.getElementById('forcastHistory');
//     forcastHistoryContainer.innerHTML = " "
//     if (forcastHistory.length !== 0) {
//         forcastHistoryContainer.classList.remove('hidden')
//         forcastHistory.forEach((city) => {
//             const cityHolder = document.createElement('li')
//             cityHolder.setAttribute('class', 'p-2 bg-white border hover:bg-slate-200 duration-150 flex items-center justify-between');
//             cityHolder.innerHTML = city
//             const cross = document.createElement('span')
//             cross.setAttribute('class', 'text-3xl rotate-45 cityHolder')
//             cross.innerHTML = "+"
//             cityHolder.appendChild(cross)
//             forcastHistoryContainer.appendChild(cityHolder);
//         })
//         const deleteSearchBtn = document.querySelectorAll('span.cityHolder')
//         deleteSearchBtn.forEach((deleteBtn, idx) => {
//             deleteBtn.addEventListener('click', () => {
//                 forcastHistory = forcastHistory.filter((city, index) => index !== idx)
//                 LocalStorage.store('forcastHistory', forcastHistory)
//                 displayForCastSearch()
//             })
//         })

//     }
//     else {
//         forcastHistoryContainer.classList.add('hidden')
//     }
// }




function displayForCastSearch() {
    const forcastHistoryContainer = document.getElementById('forcastHistory');
    forcastHistoryContainer.innerHTML = " "
    if (forcastHistory.length !== 0) {
        forcastHistoryContainer.classList.remove('hidden')
        forcastHistory.forEach((city) => {
            const cityHolder = document.createElement('option')
            cityHolder.innerHTML = city
            forcastHistoryContainer.appendChild(cityHolder);
        })
        forcastHistoryContainer.addEventListener('change', (event) => { searchByHistory(event) })
    }
    else {
        forcastHistoryContainer.classList.add('hidden')
    }
}




async function searchByHistory(event) {
    const searchedCity = event.target.value
    const citySearchInputEl = document.getElementById('cityNameInput');
    citySearchInputEl.value = searchedCity
    const data = await fetchByCityName(searchedCity)
    updateDisplay(data)
    // console.log(data)
}







function updateDisplay(data = null) {
    weatherDemonstration.innerHTML = ""
    forcastHolder.innerHTML = ""

    // -------------------------------------- Displaying single and todays weather --------------------------------------

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
    weatherDemonstration.innerHTML = `<img src="${todayWeatherData.imageLink}" alt="weather-img" width="200" height="200" class="object-cover">
                                         <section class="text-white space-y-3 w-full text-center sm:text-left sm:ml-12">
                                                <h3 class="text-2xl font-semibold">${data.city.name} (${todaysDate})</h3>
                                                <p>Temperature : <span>${todayWeatherData.temperature} °C</p>
                                                <p>Wind : ${todayWeatherData.windSpeed} M/S</p>
                                                <p>Humidity : ${todayWeatherData.humidity}%</p>
                                         </section>`;




    // -------------------------------------- Displaying multiple and upcoming 5 day of weather forcast  --------------------------------------


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





























// -------------------------------------- Display weather data by users current location --------------------------------------

async function displayWeatherDataByCurrentLocation(latitude, longitude) {
    weatherDemonstration.innerHTML = loading()
    forcastHolder.innerHTML = loading();

    const API_call = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`
    try {
        const response = await fetch(API_call)
        const data = await response.json();


        updateDisplay(data)

        // const weatherData = {};
        // data.list.forEach(item => {
        //     const date = new Date(item.dt * 1000).toISOString().split('T')[0];

        //     if (!weatherData[date]) {
        //         weatherData[date] = [];
        //     }

        //     const weatherInfo = {
        //         temperature: item.main.temp,
        //         humidity: item.main.humidity,
        //         windSpeed: item.wind.speed,
        //         weatherDescription: item.weather[0].description,
        //         imageLink: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        //     };
        //     weatherData[date].push(weatherInfo);
        // });

        // const todaysDate = Object.keys(weatherData).splice(0, 1)[0]

        // // fetching a weather data of for today Date
        // const todayWeatherData = weatherData[todaysDate][0];

        // // Retriving weather data 
        // weatherDemonstration.innerHTML = `<img src="${todayWeatherData.imageLink}" alt="weather-img" width="200" height="200" class="object-cover">
        //                                  <section class="text-white space-y-3 w-full text-center sm:text-left sm:ml-12">
        //                                         <h3 class="text-2xl font-semibold">${data.city.name} (${todaysDate})</h3>
        //                                         <p>Temperature : <span>${todayWeatherData.temperature} °C</p>
        //                                         <p>Wind : ${todayWeatherData.windSpeed} M/S</p>
        //                                         <p>Humidity : ${todayWeatherData.humidity}%</p>
        //                                  </section>`;


        // // -------------------------------------- Fetching weather data of upcoming 5 days --------------------------------------
        // const dates = Object.keys(weatherData).splice(1, 6)

        // forcastHolder.innerHTML = " "


        // dates.forEach(date => {
        //     const weatherDataHolder = document.createElement('section');
        //     weatherDataHolder.setAttribute('class', 'bg-blue-300 text-gray-700 space-y-3 rounded-md px-6 p-3 flex flex-col items-center sm:flex-row sm:space-x-12 md:flex-col md:mx-auto md:space-x-0 md:text-center shadow-md shadow-gray-800');

        //     const imageLink = weatherData[date][0].imageLink
        //     const temprature = weatherData[date][0].temperature
        //     const humidity = weatherData[date][0].humidity
        //     const windSpeed = weatherData[date][0].windSpeed

        //     weatherDataHolder.innerHTML = `<section class="space-y-4">
        //                                       <h3 class="text-xl font-semibold">${date}</h3>
        //                                       <img src="${imageLink}"
        //                                       alt="" width="100" height="100" class="object-cover">
        //                                    </section>
        //                                    <section class="space-y-2">
        //                                       <p>Temperature : <span>${temprature}°C</span></p>
        //                                       <p>Wind : <span>${windSpeed} M/C</span></p>
        //                                       <p>Humidity : <span>${humidity}%</span></p>
        //                                    </section>`
        //     forcastHolder.appendChild(weatherDataHolder)
        // })
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

async function searchByCity() {
    let userInputCity = document.getElementById('cityNameInput');
    weatherDemonstration.innerHTML = loading()
    forcastHolder.innerHTML = loading()

    try {
        if (userInputCity.value) {
            const data = await fetchByCityName(userInputCity.value)

            if (data.cod === '200') {
                // Add a new city into a array 
                forcastHistory.push(userInputCity.value)

                // Store updated array inside a localstorage
                LocalStorage.store('forcastHistory', forcastHistory)

                displayForCastSearch();

                userInputCity.value = ""

                updateDisplay(data);
            }
            else if (data.cod === '404') {
                weatherDemonstration.innerHTML = `<h1 class="font-semibold text-2xl">Invalid location : ${data.message}</h1>`
                forcastHolder.innerHTML = " "
            }
            else if (data.cod === '400') {
                weatherDemonstration.innerHTML = `<h1 class="font-semibold text-2xl">${data.message}</h1>`
                forcastHolder.innerHTML = " "
            }
        }
        else {
            weatherDemonstration.textContent = 'City name is not provided';
            forcastHolder.innerHTML = '';
        }
    } catch (error) {
        console.log(error)
    }
}
displayForCastSearch();


