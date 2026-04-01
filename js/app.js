import CONFIG from './config.js';
import { MovieAPI } from './api.js';
import { UI } from './ui.js';
import { Watchlist } from './watchlist.js';

let currentQuery = 'Avatar';
let currentPage = 1;
let currentResults = [];
let activeGenre = 'All';

async function init() {
    UI.renderGenrePills(CONFIG.GENRES, document.getElementById('genre-pills'), activeGenre);
    loadTrending();
    renderWatchlistItems();
    setupTheme();
}

async function loadTrending() {
    const data = await MovieAPI.getTrending();
    if (data.Search) {
        currentResults = data.Search;
        UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
    }
}

// 🎯 Search Orchestration
window.handleSearch = async () => {
    const input = document.getElementById('search-input');
    const query = input.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        UI.renderSkeletons(document.getElementById('movie-grid'));
        const data = await MovieAPI.searchMovies(currentQuery, currentPage);
        if (data.Search) {
            currentResults = data.Search;
            UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
            document.getElementById('page-num').textContent = currentPage;
        } else {
            document.getElementById('movie-grid').innerHTML = `<p class="no-results">No stories found matching "${query}"</p>`;
        }
    }
};

// 🎯 Pagination
window.loadMore = async () => {
    currentPage++;
    const data = await MovieAPI.searchMovies(currentQuery, currentPage);
    if (data.Search) {
        currentResults = [...currentResults, ...data.Search];
        UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
        document.getElementById('page-num').textContent = currentPage;
    }
};

// 🎯 Watchlist Toggle
window.handleWatchlistToggle = (id) => {
    const movie = currentResults.find(m => m.imdbID === id);
    if (!movie) return;

    const action = Watchlist.toggle(movie);
    if (action === 'added') {
        UI.showToast(`"${movie.Title}" added to watchlist`, 'success');
    } else if (action === 'removed') {
        UI.showToast(`"${movie.Title}" removed from watchlist`, 'info');
    }
    renderWatchlistItems();
};

window.toggleWatchlist = () => {
    const panel = document.getElementById('watchlist-panel');
    panel.classList.toggle('active');
};

function renderWatchlistItems() {
    const container = document.getElementById('watchlist-items');
    const watchlist = Watchlist.get();
    
    if (watchlist.length === 0) {
        container.innerHTML = `<p class="empty-msg">Your watchlist is empty.</p>`;
        return;
    }

    container.innerHTML = watchlist.map(movie => `
        <div class="watchlist-item">
            <div class="item-info">
                <span>${movie.Title}</span>
                <small>${movie.Year}</small>
            </div>
            <button onclick="window.handleWatchlistToggle('${movie.imdbID}')"><i class="ph ph-trash"></i></button>
        </div>
    `).join('');
}

// 🎯 Theme Support
window.toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    document.getElementById('theme-btn').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
};

function setupTheme() {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-btn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

// 🎯 Init Calls
document.addEventListener('DOMContentLoaded', init);
window.handleGenreChange = (genre) => {
    activeGenre = genre;
    UI.renderGenrePills(CONFIG.GENRES, document.getElementById('genre-pills'), activeGenre);
    // In a real app we would filter the query or search by genre
};

window.showDetails = async (id) => {
    UI.showToast('Fetching movie details...', 'info');
    const movie = await MovieAPI.getMovieDetails(id);
    if (movie) {
        alert(`${movie.Title} (${movie.Year})\n\nPlot: ${movie.Plot}\n\nDirector: ${movie.Director}\n\nActors: ${movie.Actors}`);
    }
};
