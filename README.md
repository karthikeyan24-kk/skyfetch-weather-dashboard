# SkyFetch Weather Dashboard

![SkyFetch Preview](https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png)

A modern, responsive, object-oriented Weather Dashboard that fetches real-time data and 5-day forecasts via the OpenWeatherMap API. Features persistent local storage, interactive city searching, and a stunning glassmorphism UI.

## 🌟 Features
* **Live Current Weather:** Searches any global city and securely returns temperature, conditions, and icons.
* **5-Day Forecast:** Neatly parses complex API lists (40 entries) to gracefully deliver a clean, 5-day future projection.
* **Search History (Local Storage):** Automatically remembers your last 5 searched cities as clickable pills.
* **Auto-Load:** Remembers and re-loads your previous city upon navigating back to the app.
* **Error Handling:** Built-in safeguards that gracefully catch and display 404s (e.g. invalid city names).
* **Modern Design:** Built with pure HTML/CSS leveraging CSS Grid, Flexbox, media queries, and `backdrop-filter` glassmorphism.

## 💻 Tech Stack
* **HTML5** & **CSS3** (Responsive CSS Grid/Flexbox)
* **JavaScript (Vanilla)**
  * Prototypal Inheritance & Constructor Functions
  * `async/await` and `Promise.all()`
  * DOM Manipulation & Event Listeners
  * Browser `localStorage` API
* **Axios** via CDN for semantic API Requests
* **OpenWeatherMap REST API**

## 🚀 Live Demo
[Insert Your Vercel URL Here]

---

## 🏗️ Getting Started

### Prerequisites
1. An [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys)

### Installation
1. Clone the repository
   \`\`\`sh
   git clone https://github.com/yourusername/skyfetch-weather-dashboard.git
   \`\`\`
2. Navigate to the directory
   \`\`\`sh
   cd skyfetch-weather-dashboard
   \`\`\`
3. Open `app.js` and input your API Key at the bottom:
   \`\`\`javascript
   const app = new WeatherApp('YOUR_API_KEY_HERE');
   \`\`\`
4. Open `index.html` in your web browser or Live Server.

## 🤝 Lessons Learned (Course Assignment)
This project was built iteratively across 4 parts to demonstrate an evolution of JavaScript features:
1. **Part 1:** Basic `axios.get()` requests utilizing `.then` Promises.
2. **Part 2:** Interactivity via DOM targeting and rewriting Promises to modern `async/await` with native `try/catch` error blocks.
3. **Part 3:** Scalability by restructuring the entire codebase to an Object-Oriented paradigm utilizing Prototype methods, the `new` keyword, and executing dual `Promise.all()` calls.
4. **Part 4:** Data Persistence by saving user sessions using `localStorage` and deploying the final build to Vercel.