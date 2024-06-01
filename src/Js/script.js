


// -------------------------------------- Fetching data --------------------------------------

const fetchData = async (cityName) => {
    const API_key = `1b07387d9e8dc1ccc89c3cf8fce4b121`;
    const API_call = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`
    try {
        const response = await fetch(API_call)
        const data = await response.json();
        printData(data)
    }
    catch (error) {
        console.error(error.message)
    }
}

// function printData(data) {
//     console.log(data)
// }