// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// Load Quran Verse of the Day
async function loadVerseOfDay() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/ayah/random/editions/en.sahih');
        const data = await response.json();
        
        if (data.data && data.data[0]) {
            const verse = data.data[0];
            document.getElementById('verseText').innerHTML = `"${verse.text}"`;
            document.getElementById('verseReference').innerHTML = `Surah ${verse.surah.name} (${verse.surah.number}:${verse.numberInSurah})`;
        }
    } catch (error) {
        console.error('Error loading verse:', error);
        document.getElementById('verseText').innerHTML = '"Indeed, prayer prohibits immorality and wrongdoing" - Quran 29:45';
    }
}

// Load Hijri Date
async function loadHijriDate() {
    try {
        const response = await fetch('http://api.aladhan.com/v1/gToH');
        const data = await response.json();
        
        if (data.data) {
            const hijri = data.data.hijri;
            document.getElementById('hijriDate').innerHTML = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
        }
    } catch (error) {
        console.error('Error loading Hijri date:', error);
        document.getElementById('hijriDate').innerHTML = 'Muharram 1446 AH';
    }
}

// Islamic Events Calendar
function loadIslamicEvents() {
    const events = [
        { name: "Islamic New Year", date: "Muharram 1" },
        { name: "Day of Ashura", date: "Muharram 10" },
        { name: "Mawlid al-Nabi", date: "Rabi' al-awwal 12" },
        { name: "Ramadan Begins", date: "Ramadan 1" },
        { name: "Eid al-Fitr", date: "Shawwal 1" },
        { name: "Day of Arafah", date: "Dhu al-Hijjah 9" },
        { name: "Eid al-Adha", date: "Dhu al-Hijjah 10" }
    ];
    
    const eventsList = document.getElementById('islamicEvents');
    if (eventsList) {
        eventsList.innerHTML = events.slice(0, 5).map(event => 
            `<li><strong>${event.name}:</strong> ${event.date}</li>`
        ).join('');
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('verseText')) loadVerseOfDay();
    if (document.getElementById('hijriDate')) loadHijriDate();
    if (document.getElementById('islamicEvents')) loadIslamicEvents();
});