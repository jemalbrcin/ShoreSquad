// Initialize map
let map;
let markers = [];
let currentWeather = null;

// Demo cleanup events
const demoCleanups = [
    { id: 1, lat: 0, lon: 0, title: 'Beach Cleanup Event', date: '2025-06-15', participants: 12 },
    { id: 2, lat: 0, lon: 0, title: 'Coastal Warriors Meetup', date: '2025-06-20', participants: 8 },
    { id: 3, lat: 0, lon: 0, title: 'Ocean Heroes Assembly', date: '2025-06-25', participants: 15 }
];

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
            
            // Add demo cleanup markers
            demoCleanups.forEach((cleanup, index) => {
                // Spread cleanup events around user's location
                const offset = 0.01 * (index + 1);
                cleanup.lat = lat + offset;
                cleanup.lon = lon + offset;
                addCleanupMarker(cleanup);
            });

            // Get weather for user's location
            getWeather(lat, lon);
        });
    }
}

// Add cleanup marker to map
function addCleanupMarker(cleanup) {
    const marker = L.marker([cleanup.lat, cleanup.lon])
        .addTo(map)
        .bindPopup(`
            <div class="popup-content">
                <h3>${cleanup.title}</h3>
                <p><i class="fas fa-calendar"></i> ${cleanup.date}</p>
                <p><i class="fas fa-users"></i> ${cleanup.participants} participants</p>
                <button onclick="joinCleanup(${cleanup.id})" class="popup-button">Join Event</button>
            </div>
        `);
    markers.push(marker);
}

// Join cleanup event
function joinCleanup(cleanupId) {
    const cleanup = demoCleanups.find(c => c.id === cleanupId);
    if (cleanup) {
        cleanup.participants++;
        updateMarkers();
        showNotification('Successfully joined the cleanup event!');
    }
}

// Update all markers
function updateMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    demoCleanups.forEach(cleanup => addCleanupMarker(cleanup));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Weather data fetching
async function getWeather(lat, lon) {
    const weatherWidget = document.getElementById('weather-widget');
    weatherWidget.innerHTML = `
        <div class="weather-info loading">
            <i class="fas fa-spinner fa-spin weather-icon"></i>
            <h3>Loading weather data...</h3>
        </div>
    `;

    try {
        const API_KEY = '25731bb0c49d0a1c314ee5e97bc62398'; // Replace with your API key
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}`);
        }

        const data = await response.json();
        updateWeatherWidget(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherWidget.innerHTML = `
            <div class="weather-info error">
                <i class="fas fa-exclamation-circle weather-icon"></i>
                <h3>Unable to load weather data</h3>
                <p>Please try again later</p>
                <button onclick="retryWeather(${lat}, ${lon})" class="retry-button">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Retry weather data fetch
function retryWeather(lat, lon) {
    getWeather(lat, lon);
}

// Update weather widget
function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weather-widget');
    if (data) {
        const weatherIcon = getWeatherIcon(data.weather[0].main);
        weatherWidget.innerHTML = `
            <div class="weather-info">
                <i class="${weatherIcon} weather-icon"></i>
                <h3>${data.name}</h3>
                <p class="temp">${Math.round(data.main.temp)}°C</p>
                <p class="desc">${data.weather[0].description}</p>
                <div class="details">
                    <span><i class="fas fa-tint"></i> ${data.main.humidity}%</span>
                    <span><i class="fas fa-wind"></i> ${Math.round(data.wind.speed)} m/s</span>
                </div>
                <p class="updated">Last updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        currentWeather = data;
    }
}

// Get weather icon
function getWeatherIcon(weatherType) {
    const icons = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Snow': 'fas fa-snowflake',
        'Thunderstorm': 'fas fa-bolt',
        'Drizzle': 'fas fa-cloud-rain',
        'Mist': 'fas fa-smog',
        'Fog': 'fas fa-smog',
        'Haze': 'fas fa-smog',
        'Dust': 'fas fa-smog',
        'Smoke': 'fas fa-smog',
        'Tornado': 'fas fa-wind'
    };
    return icons[weatherType] || 'fas fa-cloud';
}

// Squad stats with animations
function updateSquadStats() {
    const statsContainer = document.querySelector('.stats-container');
    const stats = [
        { icon: 'fas fa-trash-alt', title: 'Beaches Cleaned', value: 5 },
        { icon: 'fas fa-users', title: 'Squad Members', value: 12 },
        { icon: 'fas fa-star', title: 'Impact Score', value: 850 }
    ];
    
    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <i class="${stat.icon}"></i>
            <h3>${stat.title}</h3>
            <p class="counter" data-target="${stat.value}">0</p>
        </div>
    `).join('');

    // Animate numbers
    animateNumbers();
}

// Animate numbers
function animateNumbers() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            counter.textContent = Math.floor(current);
            if (current < target) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

function toggleMobileMenu() {
    navLinks.classList.toggle('show');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateSquadStats();
    
    // Mobile menu event listener
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('show') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu')) {
            toggleMobileMenu();
        }
    });
});