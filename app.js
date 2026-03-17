// Step 3: Connect API Key
function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    
    // DOM references
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-info');
    this.forecastContainer = document.getElementById('forecast-container');
    
    // Recent Searches references
    this.recentContainer = document.getElementById('recent-container');
    this.clearHistoryBtn = document.getElementById('clear-history-btn');
    this.recentSearches = [];
    
    this.init();
}

// Initialize Application
WeatherApp.prototype.init = function() {
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    
    this.cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    });

    this.clearHistoryBtn.addEventListener('click', this.clearHistory.bind(this));
    
    this.loadRecentSearches();
    this.displayRecentSearches();
    this.loadLastCity();
};

// Show Welcome message
WeatherApp.prototype.showWelcome = function() {
    const welcomeHTML = `
        <div class="welcome-message">
            <h2 class="city">🌍 Welcome!</h2>
            <p class="description">Search for a city to get its current weather and 5-day forecast.</p>
        </div>
    `;
    this.weatherDisplay.innerHTML = welcomeHTML;
    this.forecastContainer.innerHTML = '';
    this.forecastContainer.classList.add('hidden');
};

// Handle User Search Action
WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();
    
    if (!city) { 
        this.showError('Please enter a city name.'); 
        return; 
    }
    
    this.getWeather(city);
    this.cityInput.value = '';
};

// Fetch Current and Forecast Data Using Promise.all
WeatherApp.prototype.getWeather = async function(city) {
    this.showLoading();
    
    this.searchBtn.disabled = true;
    this.cityInput.disabled = true;
    
    const currentEndpoint = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastEndpoint = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentEndpoint),
            axios.get(forecastEndpoint)
        ]);
        
        console.log('Current Data:', currentRes.data);
        console.log('Forecast Data:', forecastRes.data);
        
        this.displayWeather(currentRes.data);
        
        const dailyData = this.processForecastData(forecastRes.data.list);
        this.displayForecast(dailyData);
        
        // Save the successful search to localStorage
        this.saveRecentSearch(currentRes.data.name);
        localStorage.setItem('lastCity', currentRes.data.name);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        
        this.forecastContainer.classList.add('hidden');
        this.forecastContainer.innerHTML = '';
        
        if (this.apiKey === 'YOUR_API_KEY') {
            this.showError('Please insert your OpenWeatherMap API Key in app.js');
        } else if (error.response && error.response.status === 404) {
            this.showError(`City not found. Please try again.`);
        } else {
            this.showError('Something went wrong checking the weather...');
        }
        
    } finally {
        this.searchBtn.disabled = false;
        this.cityInput.disabled = false;
        this.cityInput.focus();
    }
};

// Display Current Weather Area
WeatherApp.prototype.displayWeather = function(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    
    const weatherHTML = `
        <h2 class="city">${cityName}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="icon">
        <div class="temp">${temperature}&deg;C</div>
        <div class="description">${description}</div>
    `;
    
    this.weatherDisplay.innerHTML = weatherHTML;
};

// Process Data to only get exactly daily entries (one per day noonish)
WeatherApp.prototype.processForecastData = function(list) {
    return list.filter(item => item.dt_txt.includes('12:00:00'));
};

// Render Forecast Grid Cards
WeatherApp.prototype.displayForecast = function(dailyData) {
    this.forecastContainer.innerHTML = ''; // Clear old data
    this.forecastContainer.classList.remove('hidden');
    
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let forecastHTML = '';
    
    dailyData.forEach(day => {
        const dateObj = new Date(day.dt * 1000);
        const dayName = daysArr[dateObj.getDay()];
        const icon = day.weather[0].icon;
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;
        
        forecastHTML += `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="forecast-icon">
                <div class="forecast-temp">${temp}&deg;C</div>
                <div class="forecast-desc">${description}</div>
            </div>
        `;
    });
    
    this.forecastContainer.innerHTML = forecastHTML;
};


// Handle Reusable UI States
WeatherApp.prototype.showLoading = function() {
    const loadingHTML = `
        <div class="spinner"></div>
        <p class="loading">Fetching data...</p>
    `;
    this.weatherDisplay.innerHTML = loadingHTML;
    this.forecastContainer.classList.add('hidden');
};

WeatherApp.prototype.showError = function(message) {
    const errorHTML = `
        <p class="error-message">${message}</p>
    `;
    this.weatherDisplay.innerHTML = errorHTML;
    this.forecastContainer.classList.add('hidden');
};

// Local Storage Functionality
WeatherApp.prototype.loadRecentSearches = function() {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
        this.recentSearches = JSON.parse(stored);
    } else {
        this.recentSearches = [];
    }
};

WeatherApp.prototype.saveRecentSearch = function(city) {
    // Format to Title Case
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    
    // Remove if exists to prevent duplicates
    this.recentSearches = this.recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to front
    this.recentSearches.unshift(formattedCity);
    
    // Keep max 5 searches
    if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function() {
    this.recentContainer.innerHTML = '';
    
    if (this.recentSearches.length > 0) {
        this.clearHistoryBtn.classList.remove('hidden');
        
        this.recentSearches.forEach(city => {
            const btn = document.createElement('button');
            btn.className = 'recent-btn';
            btn.textContent = city;
            
            btn.addEventListener('click', () => {
                this.getWeather(city);
            });
            
            this.recentContainer.appendChild(btn);
        });
    } else {
        this.clearHistoryBtn.classList.add('hidden');
    }
};

WeatherApp.prototype.loadLastCity = function() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        this.getWeather(lastCity);
    } else {
        this.showWelcome();
    }
};

WeatherApp.prototype.clearHistory = function() {
    localStorage.removeItem('recentSearches');
    localStorage.removeItem('lastCity');
    this.recentSearches = [];
    this.displayRecentSearches();
};


// Boot application
// INSERT YOUR API KEY HERE
const app = new WeatherApp('YOUR_API_KEY');
