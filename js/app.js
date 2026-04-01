(function() {
    let currentQuery = 'Avatar';
    let currentPage = 1;
    let currentResults = [];
    let activeGenre = 'All';
    let searchTimeout = null;

    async function init() {
        window.UI.renderGenrePills(window.CONFIG.GENRES, document.getElementById('genre-pills'), activeGenre);
        loadTrending();
        renderWatchlistItems();
        setupTheme();
        setupSearchListeners();
    }

    async function loadTrending() {
        window.UI.renderSkeletons(document.getElementById('movie-grid'));
        const movies = await window.MovieAPI.getTrending();
        if (movies && movies.length > 0) {
            currentResults = movies;
            window.UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
        }
    }

    // 🎯 Search Orchestration
    window.handleSearch = async () => {
        const input = document.getElementById('search-input');
        const query = input.value.trim();
        if (query) {
            currentQuery = query;
            currentPage = 1;
            window.UI.renderSkeletons(document.getElementById('movie-grid'));
            const data = await window.MovieAPI.searchMovies(currentQuery, currentPage);
            if (data.Search) {
                currentResults = data.Search;
                window.UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
                document.getElementById('page-num').textContent = currentPage;
            } else {
                document.getElementById('movie-grid').innerHTML = `<p class="no-results">No movies found for "${query}"</p>`;
            }
        }
    };

    // 🎯 Debounced Live Search
    function setupSearchListeners() {
        const input = document.getElementById('search-input');
        if (!input) return;

        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            if (query.length > 2) {
                searchTimeout = setTimeout(() => window.handleSearch(), 500);
            }
        });
    }

    // 🎯 Quick Search Tags
    window.quickSearch = (keyword) => {
        const input = document.getElementById('search-input');
        input.value = keyword;
        window.handleSearch();
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // 🎯 Genre Filter Logic
    window.handleGenreChange = async (genre) => {
        activeGenre = genre;
        window.UI.renderGenrePills(window.CONFIG.GENRES, document.getElementById('genre-pills'), activeGenre);
        window.UI.renderSkeletons(document.getElementById('movie-grid'));

        if (genre === '🔥 New Arrivals') {
            currentQuery = '2025';
            currentPage = 1;
            const data = await window.MovieAPI.searchMovies(currentQuery, currentPage);
            currentResults = data.Search || [];
        } else if (genre === 'All') {
            const movies = await window.MovieAPI.getTrending();
            currentResults = movies;
        } else {
            // Remove the icon for searching (e.g. Action instead of Action icon)
            const cleanGenre = genre.replace(/[^a-zA-Z]/g, '');
            currentPage = 1;
            const data = await window.MovieAPI.searchMovies(cleanGenre, currentPage);
            currentResults = data.Search || [];
        }
        
        if (currentResults.length > 0) {
            window.UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
        } else {
            document.getElementById('movie-grid').innerHTML = `<p class="no-results">Discovering ${genre} stories... Try another search!</p>`;
        }
    };

    // 🎯 Sorting Logic (Client-Side)
    window.handleSort = () => {
        const sortType = document.getElementById('sort-select').value;
        let sorted = [...currentResults];

        if (sortType === 'year') {
            sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        } else if (sortType === 'title') {
            sorted.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (sortType === 'pop') {
            // OMDB doesn't give popularity, so we just use the default order which is usually importance
            sorted = [...currentResults];
        }

        window.UI.renderMovieCards(sorted, document.getElementById('movie-grid'));
    };

    // 🎯 Pagination
    window.loadMore = async () => {
        currentPage++;
        const data = await window.MovieAPI.searchMovies(currentQuery, currentPage);
        if (data.Search) {
            currentResults = [...currentResults, ...data.Search];
            window.UI.renderMovieCards(currentResults, document.getElementById('movie-grid'));
            document.getElementById('page-num').textContent = currentPage;
        }
    };

    // 🎯 Watchlist Essentials
    window.handleWatchlistToggle = (id) => {
        const movie = currentResults.find(m => m.imdbID === id) || window.Watchlist.get().find(m => m.imdbID === id);
        if (!movie) return;

        const action = window.Watchlist.toggle(movie);
        if (action === 'added') {
            window.UI.showToast(`"${movie.Title}" added to watchlist`, 'success');
        } else if (action === 'removed') {
            window.UI.showToast(`"${movie.Title}" removed from watchlist`, 'info');
        }
        renderWatchlistItems();
    };

    window.toggleWatchlist = () => {
        document.getElementById('watchlist-panel').classList.toggle('active');
    };

    function renderWatchlistItems() {
        const container = document.getElementById('watchlist-items');
        const watchlist = window.Watchlist.get();
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

    // 🎯 UI & Theme
    window.toggleTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        document.getElementById('theme-btn').textContent = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem(window.CONFIG.STORAGE_KEYS.THEME, newTheme);
    };

    function setupTheme() {
        const savedTheme = localStorage.getItem(window.CONFIG.STORAGE_KEYS.THEME) || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-btn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }

    window.showDetails = async (id) => {
        window.UI.showToast('Fetching movie details...', 'info');
        const movie = await window.MovieAPI.getMovieDetails(id);
        if (movie) {
            alert(`${movie.Title} (${movie.Year})\n\nPlot: ${movie.Plot}\n\nActors: ${movie.Actors}`);
        }
    };

    document.addEventListener('DOMContentLoaded', init);
})();
