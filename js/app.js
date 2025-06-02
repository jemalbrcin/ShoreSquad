// Initialize map
let map;
let markers = [];

// Map initialization
function initMap() {
    map = L.map('cleanup-map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user's location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 13);
        });
    }
}

// Weather data fetching
async function getWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=25731bb0c49d0a1c314ee5e97bc62398`);
        const data = await response.json();
        updateWeatherWidget(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Update weather widget
function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weather-widget');
    if (data) {
        weatherWidget.innerHTML = `
            <div class="weather-info">
                <h3>${data.name}</h3>
                <p>${Math.round(data.main.temp)}°C</p>
                <p>${data.weather[0].description}</p>
            </div>
        `;
    }
}

// Squad stats
function updateSquadStats() {
    const statsContainer = document.querySelector('.stats-container');
    // Demo stats - will be replaced with real data
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Beaches Cleaned</h3>
            <p>5</p>
        </div>
        <div class="stat-card">
            <h3>Squad Members</h3>
            <p>12</p>
        </div>
        <div class="stat-card">
            <h3>Impact Score</h3>
            <p>850</p>
        </div>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateSquadStats();
});

// Mobile menu toggle (to be implemented)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}
