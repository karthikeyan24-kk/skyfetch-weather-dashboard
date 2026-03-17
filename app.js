// Step 3: Get API Key
// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY';

const weatherInfo = document.getElementById('weather-info');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

// Show loading spinner
function showLoading() {
    weatherInfo.innerHTML = '<div class="spinner"></div><p class="loading">Loading weather data...</p>';
    searchBtn.disabled = true;
    cityInput.disabled = true;
}

// Display error message
function showError(message) {
    weatherInfo.innerHTML = `<p class="error-message">${message}</p>`;
}

// Fetch weather data (Async/Await)
async function getWeather(city) {
    if (!city) return;
    
    showLoading();
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        console.log('Weather Data:', response.data);
        
        const { name } = response.data;
        const { temp } = response.data.main;
        const { description, icon } = response.data.weather[0];
        
        weatherInfo.innerHTML = `
            <h2 class="city">${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="icon">
            <div class="temp">${Math.round(temp)}&deg;C</div>
            <div class="description">${description}</div>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        if (API_KEY === 'YOUR_API_KEY') {
            showError("Please insert your actual OpenWeatherMap API Key in app.js");
        } else if (error.response && error.response.status === 404) {
            showError("City not found. Please try again.");
        } else {
            showError("Failed to load weather data. Check console for details.");
        }
    } finally {
        searchBtn.disabled = false;
        cityInput.disabled = false;
        cityInput.focus();
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = '';
    } else {
        showError("Please enter a city name.");
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = '';
        } else {
            showError("Please enter a city name.");
        }
    }
});

// Initial greeting
weatherInfo.innerHTML = `
    <h2 class="city">Welcome!</h2>
    <p class="description">Search for a city to get started.</p>
`;
