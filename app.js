// Step 3: Get API Key
// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY';
const CITY = 'London';

// Step 4: Make First API Call (Axios)
const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

const weatherInfo = document.getElementById('weather-info');

// Fetch weather data
axios.get(url)
    .then(response => {
        // Log response to console
        console.log('Weather Data:', response.data);
        
        const { name } = response.data;
        const { temp } = response.data.main;
        const { description, icon } = response.data.weather[0];
        
        // Display weather data (city, temp, description, icon)
        weatherInfo.innerHTML = `
            <h2 class="city">${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="icon">
            <div class="temp">${Math.round(temp)}&deg;C</div>
            <div class="description">${description}</div>
        `;
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        
        if (API_KEY === 'YOUR_API_KEY') {
            weatherInfo.innerHTML = `<p class="error-message">Please insert your actual OpenWeatherMap API Key in app.js</p>`;
        } else {
            weatherInfo.innerHTML = `<p class="error-message">Failed to load weather data. Check console for details.</p>`;
        }
    });
