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
const WATCHMODE_API_KEY = 'your_watchmode_key'; // Get yours at api.watchmode.com

// --- APP STATE ---
let state = {
    allMovies: [],      // Combined movies from various sources
    filteredMovies: [], // Sub-set after filters/sorting
    watchlist: JSON.parse(localStorage.getItem('movie_watchlist')) || [],
    currentTab: 'trending',
    loading: false,
    genreMap: {},        // TMDB genre IDs to names
    isMock: false       // Flag if we are using mock data
};

// --- MOCK DATA ---
const MOCK_MOVIES = [
    {
        id: 'mock-1',
        title: 'Inception',
        year: '2010',
        rating: '8.8',
        poster: 'https://image.tmdb.org/t/p/w500/o0jNaSjmS79uRojJuE9v8Zp9v8g.jpg',
        genres: ['Action', 'Sci-Fi', 'Adventure'],
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
    },
    {
        id: 'mock-2',
        title: 'The Dark Knight',
        year: '2008',
        rating: '9.0',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9QmSbmrKwszVfSyc.jpg',
        genres: ['Action', 'Crime', 'Drama'],
        plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
    },
    {
        id: 'mock-3',
        title: 'Interstellar',
        year: '2014',
        rating: '8.7',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6Mxlv6vD2.jpg',
        genres: ['Adventure', 'Drama', 'Sci-Fi'],
        plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
    },
    {
        id: 'mock-4',
        title: 'Parasite',
        year: '2019',
        rating: '8.5',
        poster: 'https://image.tmdb.org/t/p/w500/7IiTTjMvS2vR7ZcZ2S9vVvUAk1Z.jpg',
        genres: ['Comedy', 'Drama', 'Thriller'],
        plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
    },
    {
        id: 'mock-5',
        title: 'Everything Everywhere All at Once',
        year: '2022',
        rating: '7.8',
        poster: 'https://image.tmdb.org/t/p/w500/rKvC73aCoFp68m9n7AKqGUEq67c.jpg',
        genres: ['Action', 'Adventure', 'Comedy'],
        plot: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.'
    },
    {
        id: 'mock-6',
        title: 'Pushpa: The Rise - Part 1',
        year: '2021',
        rating: '7.6',
        poster: 'https://image.tmdb.org/t/p/w500/yj9EcvO7S6hlK9K7L6vYen0xGIs.jpg',
        genres: ['Action', 'Crime', 'Drama'],
        plot: 'Violence erupts between red sandalwood smugglers and the police who are tasked with taking down their organization in the Seshachalam forests of South India.'
    },
    {
        id: 'mock-7',
        title: 'Pushpa 2: The Rule',
        year: '2024',
        rating: '8.5',
        poster: 'https://image.tmdb.org/t/p/w500/fR9nB6Wk9V4V6Z6jR5zJ4L6m3Z.jpg',
        genres: ['Action', 'Crime', 'Drama'],
        plot: 'The clash continues between Pushpa Raj and Bhanwar Singh Shekhawat in this epic sequel.'
    }
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
    if (OMDB_API_KEY === 'your_omdb_key' || TMDB_BEARER_TOKEN === 'your_tmdb_bearer_token' || WATCHMODE_API_KEY === 'your_watchmode_key') {
        state.isMock = true;
        // Populate some hardcoded genres for filtering
        const mockGenres = [
            {id: 28, name: 'Action'}, {id: 12, name: 'Adventure'}, 
            {id: 35, name: 'Comedy'}, {id: 18, name: 'Drama'},
            {id: 878, name: 'Sci-Fi'}, {id: 53, name: 'Thriller'}
        ];
        mockGenres.forEach(genre => {
            state.genreMap[genre.id] = genre.name;
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            elements.genreFilter.appendChild(option);
        });
        return;
    }

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
        state.isMock = true;
    }
}

// Load Trending Movies (TMDB)
async function loadTrendingMovies() {
    setLoading(true);

    if (state.isMock) {
        state.allMovies = [...MOCK_MOVIES];
        applyFiltersAndSort();
        setLoading(false);
        showMockWarning();
        return;
    }

    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week', {
            headers: { 'Authorization': `Bearer ${TMDB_BEARER_TOKEN}` }
        });
        const data = await response.json();
        if (data.results) {
            state.allMovies = data.results.map(movie => formatTMDBMovie(movie));
            applyFiltersAndSort();
        } else {
            state.isMock = true;
            loadTrendingMovies(); // Retry with mock
        }
    } catch (error) {
        console.error('Error loading trending:', error);
        state.isMock = true;
        loadTrendingMovies();
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

    if (state.isMock) {
        // Search in mock data using filter() and includes()
        state.allMovies = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
        applyFiltersAndSort();
        setLoading(false);
        return;
    }

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

// Fetch Streaming Sources from Watchmode
async function fetchWatchmodeSources(title) {
    if (state.isMock) {
        return [
            { name: 'Netflix', type: 'sub', web_url: '#' },
            { name: 'Disney+', type: 'sub', web_url: '#' },
            { name: 'Amazon Prime', type: 'sub', web_url: '#' }
        ];
    }

    try {
        // Multi-step: Search for ID, then get sources
        const searchRes = await fetch(`https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(title)}&types=movie`);
        const searchData = await searchRes.json();
        
        if (searchData.title_results && searchData.title_results.length > 0) {
            const wmId = searchData.title_results[0].id;
            const sourceRes = await fetch(`https://api.watchmode.com/v1/title/${wmId}/sources/?apiKey=${WATCHMODE_API_KEY}`);
            return await sourceRes.json();
        }
        return [];
    } catch (error) {
        console.error('Watchmode error:', error);
        return [];
    }
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

async function showMovieDetails(movie) {
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
                
                <div id="streaming-sources" style="margin-bottom: 2rem;">
                    <p><strong>Available on:</strong></p>
                    <div class="loader-container" style="height: 50px;">
                        <div class="loader" style="width: 24px; height: 24px; border-width: 3px;"></div>
                    </div>
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

    // Fetch and display streaming sources
    const sources = await fetchWatchmodeSources(movie.title);
    renderStreamingSources(sources);

    const modalWatchBtn = document.getElementById('modal-watchlist-btn');
    modalWatchBtn.onclick = () => {
        toggleWatchlist(movie);
        modalWatchBtn.textContent = state.watchlist.some(m => m.id === movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist';
        renderMovies(); // Update background
    };
}

function renderStreamingSources(sources) {
    const container = document.getElementById('streaming-sources');
    if (!sources || sources.length === 0) {
        container.innerHTML = '<p><strong>Available on:</strong> Not available for streaming.</p>';
        return;
    }

    // Use filter + map (HOF) to show unique sources
    const uniqueSources = sources.filter((source, index, self) => 
        index === self.findIndex((s) => s.name === source.name)
    );

    container.innerHTML = `
        <p><strong>Available on:</strong></p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
            ${uniqueSources.map(s => `
                <span style="background: var(--accent-color); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                    ${s.name}
                </span>
            `).join('')}
        </div>
    `;
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
function showMockWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        background-color: #fbbf24;
        color: #000;
        text-align: center;
        padding: 0.5rem;
        font-weight: 600;
        position: sticky;
        top: 70px;
        z-index: 999;
    `;
    warning.innerHTML = `Running in <strong>Mock Mode</strong>. Please add your API keys in <code>app.js</code> to use the real API.`;
    document.body.prepend(warning);
}
