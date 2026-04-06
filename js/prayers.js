// Prayer times functionality
let userLat = null;
let userLon = null;
let userCity = '';
let userCountry = '';

// Get prayer times based on coordinates
async function getPrayerTimes(lat, lon, city = '', country = '') {
    try {
        const url = city && country ? 
            `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2` :
            `http://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data) {
            displayPrayerTimes(data.data);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        alert('Error fetching prayer times. Please try again.');
    }
}

// Display prayer times
function displayPrayerTimes(data) {
    const timings = data.timings;
    const date = data.date;
    
    // Update times
    document.getElementById('fajr').textContent = timings.Fajr;
    document.getElementById('sunrise').textContent = timings.Sunrise;
    document.getElementById('dhuhr').textContent = timings.Dhuhr;
    document.getElementById('asr').textContent = timings.Asr;
    document.getElementById('maghrib').textContent = timings.Maghrib;
    document.getElementById('isha').textContent = timings.Isha;
    
    // Update dates
    document.getElementById('gregorianDate').innerHTML = `${date.gregorian.date} (${date.gregorian.weekday.en})`;
    document.getElementById('hijriDatePrayer').innerHTML = `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} AH`;
    
    // Calculate next prayer
    calculateNextPrayer(timings);
}

// Calculate next prayer
function calculateNextPrayer(timings) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
    ];
    
    let nextPrayer = null;
    for (let prayer of prayers) {
        if (currentTime < prayer.time) {
            nextPrayer = prayer;
            break;
        }
    }
    
    if (!nextPrayer) {
        nextPrayer = prayers[0]; // Next day's Fajr
    }
    
    document.getElementById('nextPrayer').innerHTML = `${nextPrayer.name} at ${nextPrayer.time}`;
}

// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                getPrayerTimes(userLat, userLon);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enter city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter city manually.');
    }
}

// Search by city
function searchByCity() {
    const city = document.getElementById('cityInput').value;
    const country = document.getElementById('countryInput').value;
    
    if (city && country) {
        userCity = city;
        userCountry = country;
        getPrayerTimes(null, null, city, country);
    } else {
        alert('Please enter both city and country');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const searchBtn = document.getElementById('searchLocationBtn');
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getLocation);
        // Try auto-get location
        getLocation();
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchByCity);
    }
    
    // Enter key for search
    const cityInput = document.getElementById('cityInput');
    const countryInput = document.getElementById('countryInput');
    
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchByCity();
        });
    }
    
    if (countryInput) {
        countryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchByCity();
        });
    }
});