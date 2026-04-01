/**
 * Movie Explorer - Milestone 2 & 3 Core Logic
 * Author: Ayush Kumar
 * -----------------------------------------
 * Features:
 * - API Integration (OMDb, TMDB)
 * - Array HOFs for Search, Filter, Sort
 * - Watchlist with Local Storage
 * - Dark/Light Mode Theme Toggle
 */

// --- API CONFIGURATION ---
// Replace these with your own API keys as per README.md
const OMDB_API_KEY = 'your_omdb_key'; // Get yours at omdbapi.com
const TMDB_BEARER_TOKEN = 'your_tmdb_bearer_token'; // Get yours at developer.themoviedb.org

// --- APP STATE ---
let state = {
    allMovies: [],      // Combined movies from various sources
    filteredMovies: [], // Sub-set after filters/sorting
    watchlist: JSON.parse(localStorage.getItem('movie_watchlist')) || [],
    currentTab: 'trending',
    loading: false,
    genreMap: {}        // TMDB genre IDs to names
};

// --- DOM ELEMENTS ---
const elements = {
    movieGrid: document.getElementById('movie-display'),
    searchBox: document.getElementById('movie-search'),
    searchBtn: document.getElementById('search-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    genreFilter: document.getElementById('genre-filter'),
    sortFilter: document.getElementById('sort-filter'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    watchlistCount: document.getElementById('watchlist-count'),
    loader: document.getElementById('main-loader'),
    emptyState: document.getElementById('empty-state'),
    modal: document.getElementById('movie-modal'),
    modalBody: document.getElementById('modal-body'),
    closeModal: document.querySelector('.close-modal')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    updateWatchlistUI();
    await fetchGenres();
    await loadTrendingMovies();
    applyInitialTheme();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Search
    elements.searchBtn.addEventListener('click', () => handleSearch());
    elements.searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Theme Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Filters
    elements.genreFilter.addEventListener('change', () => applyFiltersAndSort());
    elements.sortFilter.addEventListener('change', () => applyFiltersAndSort());

    // Tabs
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
            elements.tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Modal close
    elements.closeModal.onclick = () => elements.modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == elements.modal) elements.modal.style.display = 'none';
    };
}

// --- API CALLS ---

// Fetch Genres from TMDB
async function fetchGenres() {
    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', {
            headers: { 'Authorization': `Bearer ${TMDB_BEARER_TOKEN}` }
        });
        const data = await response.json();
        if (data.genres) {
            data.genres.forEach(genre => {
                state.genreMap[genre.id] = genre.name;
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                elements.genreFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Load Trending Movies (TMDB)
async function loadTrendingMovies() {
    setLoading(true);
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week', {
            headers: { 'Authorization': `Bearer ${TMDB_BEARER_TOKEN}` }
        });
        const data = await response.json();
        state.allMovies = data.results.map(movie => formatTMDBMovie(movie));
        applyFiltersAndSort();
    } catch (error) {
        console.error('Error loading trending:', error);
    } finally {
        setLoading(false);
    }
}

// Search Movies (OMDb)
async function handleSearch() {
    const query = elements.searchBox.value.trim();
    if (!query) return;

    setLoading(true);
    switchTab('search-results');
    document.getElementById('search-tab').style.display = 'block';
    elements.tabButtons.forEach(b => b.classList.remove('active'));
    document.getElementById('search-tab').classList.add('active');

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            // Get detailed info for each result to get ratings and full genres
            const detailedPromises = data.Search.map(m => fetchMovieDetail(m.imdbID));
            state.allMovies = await Promise.all(detailedPromises);
            applyFiltersAndSort();
        } else {
            state.filteredMovies = [];
            renderMovies();
        }
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        setLoading(false);
    }
}

async function fetchMovieDetail(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    return formatOMDBMovie(data);
}

// --- DATA FORMATTERS ---
function formatTMDBMovie(m) {
    return {
        id: m.id,
        imdbID: null, // Will fetch if needed
        title: m.title,
        year: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
        rating: m.vote_average ? m.vote_average.toFixed(1) : 'N/A',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
        genres: m.genre_ids ? m.genre_ids.map(id => state.genreMap[id]).filter(Boolean) : [],
        plot: m.overview
    };
}

function formatOMDBMovie(m) {
    return {
        id: m.imdbID,
        imdbID: m.imdbID,
        title: m.Title,
        year: m.Year,
        rating: m.imdbRating !== 'N/A' ? m.imdbRating : 'N/A',
        poster: m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/500x750?text=No+Poster',
        genres: m.Genre ? m.Genre.split(',').map(g => g.trim()) : [],
        plot: m.Plot
    };
}

// --- HOF LOGIC (CORE REQUIREMENT) ---

function applyFiltersAndSort() {
    const selectedGenre = elements.genreFilter.value;
    const sortBy = elements.sortFilter.value;

    let results = [...state.allMovies];

    // Filter by Genre
    if (selectedGenre !== 'all') {
        const genreName = state.genreMap[selectedGenre] || selectedGenre;
        results = results.filter(movie => movie.genres.includes(genreName));
    }

    // Sort
    results.sort((a, b) => {
        if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'latest') return parseInt(b.year) - parseInt(a.year);
        return 0;
    });

    state.filteredMovies = results;
    renderMovies();
}

function switchTab(tabName) {
    state.currentTab = tabName;
    if (tabName === 'trending') {
        loadTrendingMovies();
    } else if (tabName === 'watchlist') {
        state.filteredMovies = state.watchlist;
        renderMovies();
    }
}

// --- UI RENDERING ---

function renderMovies() {
    elements.movieGrid.innerHTML = ''; // Clear grid
    
    // Check for empty state
    if (state.filteredMovies.length === 0) {
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';

    // Use map() to create movie cards
    const movieCards = state.filteredMovies.map(movie => {
        const isFavorited = state.watchlist.some(m => m.id === movie.id);
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <button class="bookmark-btn ${isFavorited ? 'active' : ''}" data-id="${movie.id}">
                <i class="${isFavorited ? 'fas' : 'far'} fa-bookmark"></i>
            </button>
            <div class="poster-container">
                <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                <div class="movie-overlay">
                    <p class="movie-plot-snippet">${movie.plot ? movie.plot.substring(0, 100) + '...' : 'No description available.'}</p>
                </div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.year}</span>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.rating}</span>
                    </div>
                </div>
            </div>
        `;

        // Click card for details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.bookmark-btn')) {
                showMovieDetails(movie);
            }
        });

        // Click bookmark
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
            bookmarkBtn.classList.toggle('active');
            const icon = bookmarkBtn.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
        });

        return card;
    });

    // Append all cards
    movieCards.forEach(card => elements.movieGrid.appendChild(card));
}

function showMovieDetails(movie) {
    elements.modalBody.innerHTML = `
        <div class="modal-body-content">
            <div class="modal-poster">
                <img src="${movie.poster}" alt="${movie.title}">
            </div>
            <div class="modal-info">
                <h2>${movie.title} (${movie.year})</h2>
                <div class="rating" style="margin: 1rem 0; font-size: 1.25rem;">
                    <i class="fas fa-star"></i>
                    <span>${movie.rating} / 10</span>
                </div>
                <p><strong>Genres:</strong> ${movie.genres.join(', ')}</p>
                <div class="modal-plot" style="margin: 1.5rem 0;">
                    <p>${movie.plot || 'No plot available.'}</p>
                </div>
                <div class="watchlist-action">
                    <button id="modal-watchlist-btn" class="search-box button" style="width: auto;">
                        ${state.watchlist.some(m => m.id === movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>
        </div>
    `;
    elements.modal.style.display = 'block';

    const modalWatchBtn = document.getElementById('modal-watchlist-btn');
    modalWatchBtn.onclick = () => {
        toggleWatchlist(movie);
        modalWatchBtn.textContent = state.watchlist.some(m => m.id === movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist';
        renderMovies(); // Update background
    };
}

// --- UTILS ---

function setLoading(isLoading) {
    state.loading = isLoading;
    elements.loader.style.display = isLoading ? 'flex' : 'none';
    if (isLoading) elements.emptyState.style.display = 'none';
}

function toggleWatchlist(movie) {
    const index = state.watchlist.findIndex(m => m.id === movie.id);
    if (index > -1) {
        state.watchlist.splice(index, 1);
    } else {
        state.watchlist.push(movie);
    }
    localStorage.setItem('movie_watchlist', JSON.stringify(state.watchlist));
    updateWatchlistUI();
    if (state.currentTab === 'watchlist') {
        state.filteredMovies = state.watchlist;
        renderMovies();
    }
}

function updateWatchlistUI() {
    elements.watchlistCount.textContent = state.watchlist.length;
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    elements.themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('movie_theme', isDark ? 'dark' : 'light');
}

function applyInitialTheme() {
    const savedTheme = localStorage.getItem('movie_theme');
    if (savedTheme === 'light') {
        toggleTheme();
    }
}
