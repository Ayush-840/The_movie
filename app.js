// 🔑 API KEY
const API_KEY = "a35e86be";

// 🧠 Global Data
let currentMovies = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// 🚀 Fetch Movies
async function fetchMovies(query) {
    if (!query) {
        document.getElementById("movies").innerHTML = "🔍 Start typing to search movies...";
        return;
    }

    document.getElementById("movies").innerHTML = "⏳ Loading...";

    try {
        const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

        const data = await res.json();

        if (data.Search) {
            currentMovies = data.Search;
            displayMovies(currentMovies);
        } else {
            document.getElementById("movies").innerHTML = "❌ No movies found";
        }
    } catch (error) {
        document.getElementById("movies").innerHTML = "⚠️ Error fetching data";
    }
}

// 🎯 Display Movies (forEach used correctly)
function displayMovies(movies) {
    const container = document.getElementById("movies");
    container.innerHTML = "";

    movies.forEach(movie => {
        const isAdded = watchlist.find(m => m.imdbID === movie.imdbID);

        const poster = movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/100x150?text=No+Image";

        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${movie.Title}</h3>
            <img src="${poster}" width="100"/>
            <p>📅 ${movie.Year}</p>
            <button onclick="toggleWatchlist('${movie.imdbID}')">
                ${isAdded ? "❌ Remove" : "❤️ Add"}
            </button>
        `;

        container.appendChild(div);
    });
}

// ❤️ Toggle Watchlist
function toggleWatchlist(id) {
    const exists = watchlist.find(m => m.imdbID === id);

    if (exists) {
        watchlist = watchlist.filter(m => m.imdbID !== id);
    } else {
        const movie = currentMovies.find(m => m.imdbID === id);
        if (movie) watchlist.push(movie);
    }

    // 💾 Save
    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    renderWatchlist();
    displayMovies(currentMovies);
}

// 📌 Render Watchlist
function renderWatchlist() {
    const saved = document.getElementById("saved");
    saved.innerHTML = "";

    if (watchlist.length === 0) {
        saved.innerHTML = "📭 No saved movies";
        return;
    }

    watchlist.forEach(movie => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p>${movie.Title}</p>
            <button onclick="toggleWatchlist('${movie.imdbID}')">
                ❌ Remove
            </button>
        `;

        saved.appendChild(div);
    });
}

// 🔃 SORT (by Year)
function sortMoviesByYear() {
    const sorted = [...currentMovies].sort((a, b) => b.Year - a.Year);
    displayMovies(sorted);
}

// 🎯 FILTER (Latest Movies)
function filterLatestMovies() {
    const filtered = currentMovies.filter(movie => movie.Year >= 2015);
    displayMovies(filtered);
}

// ⚡ Debounce
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const optimizedSearch = debounce(fetchMovies, 500);

// 🎯 Event Listener
document.getElementById("search").addEventListener("input", (e) => {
    optimizedSearch(e.target.value);
});

// 🚀 Initial Load
renderWatchlist();