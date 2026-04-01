/**
 * Movie Explorer - Milestone 2 & 3 Core Logic
 * Author: Ayush Kumar
 * -----------------------------------------
 */

// --- API CONFIGURATION ---
// These can be set here or via the UI Settings modal
let CONFIG = {
    OMDB_API_KEY: localStorage.getItem('omdb_key') || 'your_omdb_key',
    TMDB_BEARER_TOKEN: localStorage.getItem('tmdb_token') || 'your_tmdb_bearer_token',
    WATCHMODE_API_KEY: localStorage.getItem('watchmode_key') || 'your_watchmode_key'
};

// --- APP STATE ---
let state = {
    allMovies: [],
    filteredMovies: [],
    watchlist: JSON.parse(localStorage.getItem('movie_watchlist')) || [],
    currentTab: 'trending',
    loading: false,
    genreMap: {},
    isMock: false,
    // Pagination
    searchQuery: '',
    currentPage: 1,
    hasMore: false
};

// --- MOCK DATA ---
const MOCK_MOVIES = [
    { id: 'mock-1', title: 'Inception', year: '2010', rating: '8.8', poster: 'https://image.tmdb.org/t/p/w500/o0jNaSjmS79uRojJuE9v8Zp9v8g.jpg', genres: ['Action', 'Sci-Fi'], plot: 'A thief who steals corporate secrets through the use of dream-sharing technology.' },
    { id: 'mock-2', title: 'The Dark Knight', year: '2008', rating: '9.0', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9QmSbmrKwszVfSyc.jpg', genres: ['Action', 'Crime'], plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.' },
    { id: 'mock-3', title: 'Pushpa: The Rise', year: '2021', rating: '7.6', poster: 'https://image.tmdb.org/t/p/w500/yj9EcvO7S6hlK9K7L6vYen0xGIs.jpg', genres: ['Action', 'Crime'], plot: 'Violence erupts between red sandalwood smugglers and the police.' },
    { id: 'mock-4', title: 'Pushpa 2: The Rule', year: '2024', rating: '8.5', poster: 'https://image.tmdb.org/t/p/w500/fR9nB6Wk9V4V6Z6jR5zJ4L6m3Z.jpg', genres: ['Action', 'Crime'], plot: 'The clash continues between Pushpa Raj and Bhanwar Singh Shekhawat.' }
];

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
    
    // Modals
    movieModal: document.getElementById('movie-modal'),
    settingsModal: document.getElementById('settings-modal'),
    modalBody: document.getElementById('modal-body'),
    
    // Settings UI
    settingsWarning: document.getElementById('settings-warning'),
    openSettingsBtn: document.getElementById('open-settings-btn'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    omdbInput: document.getElementById('omdb-key-input'),
    tmdbInput: document.getElementById('tmdb-key-input'),
    watchmodeInput: document.getElementById('watchmode-key-input'),
    
    // Pagination UI
    paginationContainer: document.getElementById('pagination-container'),
    loadMoreBtn: document.getElementById('load-more-btn')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    updateWatchlistUI();
    checkApiSetup();
    await fetchGenres();
    await loadTrendingMovies();
    applyInitialTheme();
}

function checkApiSetup() {
    const isMocking = CONFIG.OMDB_API_KEY.includes('your_') || CONFIG.TMDB_BEARER_TOKEN.includes('your_');
    state.isMock = isMocking;
    elements.settingsWarning.style.display = isMocking ? 'flex' : 'none';
    
    // Fill inputs with current values
    elements.omdbInput.value = CONFIG.OMDB_API_KEY.includes('your_') ? '' : CONFIG.OMDB_API_KEY;
    elements.tmdbInput.value = CONFIG.TMDB_BEARER_TOKEN.includes('your_') ? '' : CONFIG.TMDB_BEARER_TOKEN;
    elements.watchmodeInput.value = CONFIG.WATCHMODE_API_KEY.includes('your_') ? '' : CONFIG.WATCHMODE_API_KEY;
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Debounced Search
    const debouncedSearch = debounce(() => {
        const query = elements.searchBox.value.trim();
        if (query && query !== state.searchQuery) {
            handleSearch(true);
        }
    }, 500);

    elements.searchBox.addEventListener('input', debouncedSearch);
    elements.searchBtn.addEventListener('click', () => handleSearch(true));
    elements.loadMoreBtn.addEventListener('click', () => handleSearch(false));
    
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.genreFilter.addEventListener('change', () => applyFiltersAndSort());
    elements.sortFilter.addEventListener('change', () => applyFiltersAndSort());

    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
            elements.tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Settings
    elements.openSettingsBtn.onclick = () => elements.settingsModal.style.display = 'block';
    elements.saveSettingsBtn.onclick = saveSettings;

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            elements.movieModal.style.display = 'none';
            elements.settingsModal.style.display = 'none';
        };
    });

    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
}

function saveSettings() {
    localStorage.setItem('omdb_key', elements.omdbInput.value.trim());
    localStorage.setItem('tmdb_token', elements.tmdbInput.value.trim());
    localStorage.setItem('watchmode_key', elements.watchmodeInput.value.trim());
    location.reload();
}

// --- API CALLS ---

async function fetchGenres() {
    if (state.isMock) {
        ['Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'].forEach(name => {
            state.genreMap[name] = name;
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            elements.genreFilter.appendChild(option);
        });
        return;
    }

    try {
        const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', {
            headers: { 'Authorization': `Bearer ${CONFIG.TMDB_BEARER_TOKEN}` }
        });
        const data = await res.json();
        data.genres.forEach(g => {
            state.genreMap[g.id] = g.name;
            const option = document.createElement('option');
            option.value = g.id;
            option.textContent = g.name;
            elements.genreFilter.appendChild(option);
        });
    } catch (e) {
        console.error('Genre fetch error', e);
        state.isMock = true;
    }
}

async function loadTrendingMovies() {
    setLoading(true);
    if (state.isMock) {
        state.allMovies = [...MOCK_MOVIES];
        applyFiltersAndSort();
        setLoading(false);
        return;
    }

    try {
        const res = await fetch('https://api.themoviedb.org/3/trending/movie/week', {
            headers: { 'Authorization': `Bearer ${CONFIG.TMDB_BEARER_TOKEN}` }
        });
        const data = await res.json();
        state.allMovies = data.results.map(m => formatTMDBMovie(m));
        applyFiltersAndSort();
    } catch (e) {
        console.error('Trending fetch error', e);
        state.isMock = true;
        loadTrendingMovies();
    } finally {
        setLoading(false);
    }
}

async function handleSearch(reset = true) {
    const query = elements.searchBox.value.trim();
    if (!query) return;

    if (reset) {
        state.searchQuery = query;
        state.currentPage = 1;
        state.allMovies = [];
        switchTab('search-results');
        document.getElementById('search-tab').style.display = 'block';
        elements.tabButtons.forEach(b => b.classList.remove('active'));
        document.getElementById('search-tab').classList.add('active');
    } else {
        state.currentPage++;
    }

    setLoading(true);

    if (state.isMock) {
        // Mock pagination: just show all 2 pages of mock data if they exist
        state.filteredMovies = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
        renderMovies();
        elements.paginationContainer.style.display = 'none';
        setLoading(false);
        return;
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${CONFIG.OMDB_API_KEY}&page=${state.currentPage}`);
        const data = await res.json();
        
        if (data.Response === 'True') {
            const details = await Promise.all(data.Search.map(m => fetchMovieDetail(m.imdbID)));
            state.allMovies = [...state.allMovies, ...details];
            state.hasMore = state.allMovies.length < parseInt(data.totalResults);
            applyFiltersAndSort();
        } else if (reset) {
            state.filteredMovies = [];
            state.hasMore = false;
            renderMovies();
        }
    } catch (e) {
        console.error('Search error', e);
    } finally {
        setLoading(false);
        elements.paginationContainer.style.display = state.hasMore ? 'flex' : 'none';
    }
}

async function fetchMovieDetail(id) {
    const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${CONFIG.OMDB_API_KEY}`);
    return formatOMDBMovie(await res.json());
}

async function fetchWatchmodeSources(title) {
    if (state.isMock) return [{ name: 'Netflix' }, { name: 'Disney+' }];
    try {
        const sRes = await fetch(`https://api.watchmode.com/v1/search/?apiKey=${CONFIG.WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(title)}&types=movie`);
        const sData = await sRes.json();
        if (sData.title_results?.length > 0) {
            const res = await fetch(`https://api.watchmode.com/v1/title/${sData.title_results[0].id}/sources/?apiKey=${CONFIG.WATCHMODE_API_KEY}`);
            return await res.json();
        }
        return [];
    } catch (e) { return []; }
}

// --- FORMATTERS ---
function formatTMDBMovie(m) {
    return {
        id: m.id,
        title: m.title,
        year: m.release_date?.substring(0, 4) || 'N/A',
        rating: m.vote_average?.toFixed(1) || 'N/A',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750',
        genres: m.genre_ids?.map(id => state.genreMap[id]).filter(Boolean) || [],
        plot: m.overview
    };
}

function formatOMDBMovie(m) {
    return {
        id: m.imdbID,
        title: m.Title,
        year: m.Year,
        rating: m.imdbRating !== 'N/A' ? m.imdbRating : 'N/A',
        poster: m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/500x750',
        genres: m.Genre?.split(',').map(g => g.trim()) || [],
        plot: m.Plot
    };
}

// --- HOF LOGIC ---
function applyFiltersAndSort() {
    const genre = elements.genreFilter.value;
    const sort = elements.sortFilter.value;
    let results = [...state.allMovies];

    if (genre !== 'all') {
        results = results.filter(m => m.genres.includes(state.genreMap[genre] || genre));
    }

    results.sort((a, b) => {
        if (sort === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'latest') return parseInt(b.year) - parseInt(a.year);
        return 0;
    });

    state.filteredMovies = results;
    renderMovies();
}

function switchTab(tab) {
    state.currentTab = tab;
    if (tab === 'trending') loadTrendingMovies();
    else if (tab === 'watchlist') { state.filteredMovies = state.watchlist; renderMovies(); }
}

// --- UI RENDERING ---
function renderMovies() {
    elements.movieGrid.innerHTML = '';
    if (state.filteredMovies.length === 0) { elements.emptyState.style.display = 'block'; return; }
    elements.emptyState.style.display = 'none';

    state.filteredMovies.map(movie => {
        const isFav = state.watchlist.some(m => m.id === movie.id);
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <button class="bookmark-btn ${isFav ? 'active' : ''}">
                <i class="${isFav ? 'fas' : 'far'} fa-bookmark"></i>
            </button>
            <div class="poster-container">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-overlay"><p>${movie.plot?.substring(0, 80)}...</p></div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta"><span>${movie.year}</span><div class="rating"><i class="fas fa-star"></i><span>${movie.rating}</span></div></div>
            </div>
        `;
        card.onclick = (e) => !e.target.closest('.bookmark-btn') && showMovieDetails(movie);
        card.querySelector('.bookmark-btn').onclick = (e) => { e.stopPropagation(); toggleWatchlist(movie); renderMovies(); };
        elements.movieGrid.appendChild(card);
    });
}

async function showMovieDetails(movie) {
    elements.modalBody.innerHTML = `
        <div class="modal-body-content">
            <div class="modal-poster"><img src="${movie.poster}" alt="${movie.title}"></div>
            <div class="modal-info">
                <h2>${movie.title} (${movie.year})</h2>
                <div class="rating" style="margin: 1rem 0; font-size: 1.25rem;"><i class="fas fa-star"></i><span>${movie.rating} / 10</span></div>
                <p><strong>Genres:</strong> ${movie.genres.join(', ')}</p>
                <div style="margin: 1.5rem 0;"><p>${movie.plot || 'No plot available.'}</p></div>
                <div id="streaming-sources" style="margin-bottom: 2rem;"><p><strong>Available on:</strong></p><div class="loader" style="width: 20px; height: 20px;"></div></div>
                <button id="modal-watchlist-btn" class="search-box button" style="width: auto;">${state.watchlist.some(m => m.id === movie.id) ? 'Remove' : 'Add to Watchlist'}</button>
            </div>
        </div>
    `;
    elements.movieModal.style.display = 'block';
    const sources = await fetchWatchmodeSources(movie.title);
    document.getElementById('streaming-sources').innerHTML = `<p><strong>Available on:</strong></p><div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">${sources.map(s => `<span style="background: var(--primary-color); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${s.name}</span>`).join('') || 'Not available'}</div>`;
    document.getElementById('modal-watchlist-btn').onclick = () => { toggleWatchlist(movie); showMovieDetails(movie); renderMovies(); };
}

// --- UTILS ---
function setLoading(loading) { elements.loader.style.display = loading ? 'flex' : 'none'; if (loading) elements.emptyState.style.display = 'none'; }
function toggleWatchlist(movie) {
    const idx = state.watchlist.findIndex(m => m.id === movie.id);
    if (idx > -1) state.watchlist.splice(idx, 1);
    else state.watchlist.push(movie);
    localStorage.setItem('movie_watchlist', JSON.stringify(state.watchlist));
    updateWatchlistUI();
}
function updateWatchlistUI() { elements.watchlistCount.textContent = state.watchlist.length; }
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    elements.themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('movie_theme', isDark ? 'dark' : 'light');
}
function applyInitialTheme() { if (localStorage.getItem('movie_theme') === 'light') toggleTheme(); }

// --- DEBOUNCE UTILITY ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
