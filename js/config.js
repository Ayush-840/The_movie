const CONFIG = {
    OMDB_API_KEY: 'a35e86be',
    TMDB_API_KEY: 'YOUR_TMDB_API_KEY',
    WATCHMODE_API_KEY: 'YOUR_WATCHMODE_API_KEY',
    BASE_URLS: {
        OMDB: 'https://www.omdbapi.com/',
        TMDB: 'https://api.themoviedb.org/3/'
    },
    GENRES: [
        '🔥 New Arrivals', 'All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'
    ],
    STORAGE_KEYS: {
        WATCHLIST: 'moviehub_watchlist',
        THEME: 'moviehub_theme'
    }
};

window.CONFIG = CONFIG;
