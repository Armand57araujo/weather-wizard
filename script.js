const API_KEY = '5968b859cc10d7e72cd116fba774bb27';
const BASE_URL = "https://api.openweathermap.org"
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const forecastCardsContainer = document.getElementById('weatherInfo');
const searchHistory = document.getElementById('searchHistory');
const searchHistoryContainer = document.getElementById('searchHistory');


function getForecost(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    // const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("this is my forecast data", data)
        
            document.getElementById("weatherForecast").innerHTML=''
            for (let i = 6; i < data?.list?.length; i = i + 8) {
                console.log("day", data.list[i]);
                //const weatherCard = document.getElementById('weatherInfo');
                let card = document.createElement('div');

                card.classList.add('card');

                card.innerHTML = `
                   

                    <p>Date: ${dayjs.unix(data.list[i].dt).format("MM/DD/YY")}</p>
                    <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="Weather Icon">
                    <p>Temperature: ${data.list[i].main.temp}°C</p>
                    <p>Humidity: ${data.list[i].main.humidity}%</p>
                    <p>Wind Speed: ${data.list[i].wind.speed} m/s</p>
                    `;
     
                

                    
                    console.log("card",card)
                    document.getElementById("weatherForecast").appendChild(card)
                    // console.log("forecastCardsContainer", forecastCardsContainer)

                // forecastCardsContainer.appendChild(card);
            
            }

        })


}

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const { name, main, wind, weather } = data;
            const temperature = main.temp;
            const humidity = main.humidity;
            const windSpeed = wind.speed;
            const icon = weather[0].icon;
            const description = weather[0].description;
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            console.log(data)
            getForecost(lat, lon)

            weatherInfo.innerHTML = `
<h2>${name}</h2>
<p>Date: ${new Date().toLocaleDateString()}</p>
<p>Weather: ${description}</p>
<p>Temperature: ${temperature}°C</p>
<p>Humidity: ${humidity}%</p>
<p>Wind Speed: ${windSpeed} m/s</p>
<img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
`;
        })
        .catch(error => console.error('Error:', error));

}

function addToSearchHistory(city) {
    const historyItem = document.createElement('a');
    historyItem.href = '#';
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => getWeather(city));
    searchHistory.appendChild(historyItem);
}

function displayWeather(data) {
    const weatherCards = document.getElementById('weatherCards');
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <a link= ${data.cityName} </a>
    <p>Date: ${data.date}</p>
    <img src="${data.icon}" alt="Weather Icon">
    <p>Temperature: ${data.temperature}°C</p>
    <p>Humidity: ${data.humidity}%</p>
    <p>Wind Speed: ${data.windSpeed} m/s</p>
    `;
    weatherCards.appendChild(card);

}

function addToSearchHistory(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(city);
    const len = searchHistory.length;
    console.log('len is', len);
    const truncatedSearchHistory = searchHistory.slice(len - 5);
    console.log("truncatedSearcHistory:", truncatedSearchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(truncatedSearchHistory));
    displaySearchHistory();
}


function displaySearchHistory() {

    searchHistoryContainer.innerHTML = '';
    searchHistoryContainer.innerHTML = '<h2>Search History</h2>';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        const historyItem = document.createElement('button');
        historyItem.setAttribute('type', 'button');
        historyItem.classList.add('historyItem');
        historyItem.textContent = searchHistory[i];
        historyItem.addEventListener('click', () => getWeather(searchHistory[i]));
        searchHistoryContainer.appendChild(historyItem);

    }
}

function deleteItems() {
    localStorage.clear();
}



document.addEventListener('DOMContentLoaded', displaySearchHistory);

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
        addToSearchHistory(city);
        // getForecost(lat, lon);
        
    }
    cityInput.value = '';

   
});