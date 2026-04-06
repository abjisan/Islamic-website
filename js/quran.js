// Quran data and functionality
let surahs = [];
let currentTranslation = 'en.sahih';

// Fetch all surahs
async function loadSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        surahs = data.data;
        displaySurahs(surahs);
    } catch (error) {
        console.error('Error loading surahs:', error);
        document.getElementById('surahList').innerHTML = '<div class="loading">Error loading Quran. Please refresh.</div>';
    }
}

// Display surahs in grid
function displaySurahs(surahsToShow) {
    const container = document.getElementById('surahList');
    if (!container) return;
    
    container.innerHTML = surahsToShow.map(surah => `
        <div class="surah-card" data-surah-number="${surah.number}">
            <div class="surah-number">${surah.number}</div>
            <div class="surah-name">${surah.name}</div>
            <div class="surah-english">${surah.englishName}</div>
            <small>${surah.revelationType} • ${surah.numberOfAyahs} verses</small>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.surah-card').forEach(card => {
        card.addEventListener('click', () => loadSurah(card.dataset.surahNumber));
    });
}

// Load specific surah
async function loadSurah(surahNumber) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${currentTranslation}`);
        const data = await response.json();
        
        if (data.data) {
            displayAyahs(data.data);
        }
    } catch (error) {
        console.error('Error loading surah:', error);
        alert('Error loading surah. Please try again.');
    }
}

// Display ayahs of a surah
function displayAyahs(surah) {
    const viewer = document.getElementById('ayahViewer');
    const content = document.getElementById('ayahContent');
    
    if (!viewer || !content) return;
    
    content.innerHTML = `
        <div class="surah-header">
            <h2>${surah.name} (${surah.englishName})</h2>
            <p>${surah.numberOfAyahs} verses • ${surah.revelationType}</p>
        </div>
        <div class="ayahs-container">
            ${surah.ayahs.map(ayah => `
                <div class="ayah-item">
                    <div class="ayah-number">${ayah.numberInSurah}</div>
                    <div class="ayah-text">${ayah.text}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    viewer.style.display = 'block';
    viewer.scrollIntoView({ behavior: 'smooth' });
}

// Search surahs
function searchSurahs() {
    const searchTerm = document.getElementById('searchSurah')?.value.toLowerCase();
    if (!searchTerm) {
        displaySurahs(surahs);
        return;
    }
    
    const filtered = surahs.filter(surah => 
        surah.name.toLowerCase().includes(searchTerm) ||
        surah.englishName.toLowerCase().includes(searchTerm) ||
        surah.number.toString().includes(searchTerm)
    );
    
    displaySurahs(filtered);
}

// Close ayah viewer
function closeAyahViewer() {
    const viewer = document.getElementById('ayahViewer');
    if (viewer) viewer.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('surahList')) {
        loadSurahs();
    }
    
    const searchInput = document.getElementById('searchSurah');
    if (searchInput) {
        searchInput.addEventListener('input', searchSurahs);
    }
    
    const translationSelect = document.getElementById('translationSelect');
    if (translationSelect) {
        translationSelect.addEventListener('change', (e) => {
            currentTranslation = e.target.value;
            loadSurahs();
        });
    }
    
    const closeBtn = document.getElementById('closeAyahViewer');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAyahViewer);
    }
});