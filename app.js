const omdbKey = "a35e86be";

let allSearchResults = [];
let savedMovies = JSON.parse(localStorage.getItem("mySavedMovies")) || [];

async function loadMoviesFromApi(query) {
    const listDisplay = document.getElementById("movie-display");

    if (!query) {
        listDisplay.innerHTML = "🔍 Type something to find movies...";
        return;
    }

    listDisplay.innerHTML = "⏳ Searching...";

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${omdbKey}&s=${query}`
        );

        const data = await response.json();

        if (data.Search) {
            allSearchResults = data.Search;
            renderMoviesToScreen(allSearchResults);
        } else {
            listDisplay.innerHTML = "❌ No movies found for this search";
        }
    } catch (error) {
        listDisplay.innerHTML = "⚠️ Something went wrong while fetching data";
    }
}

function renderMoviesToScreen(movies) {
    const container = document.getElementById("movie-display");
    container.innerHTML = "";

    if (movies.length === 0) {
        container.innerHTML = "📭 Use the search box above to find movies...";
        return;
    }

    movies.forEach(movie => {
        const isAlreadySaved = savedMovies.find(item => item.imdbID === movie.imdbID);

        const posterUrl = movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/200x300?text=No+Image";

        const card = document.createElement("div");
        card.className = "single-movie-card";

        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}"/>
            <h3>${movie.Title}</h3>
            <p><i class="ph ph-calendar"></i> ${movie.Year}</p>
            <button onclick="handleSaveToggle('${movie.imdbID}')">
                ${isAlreadySaved ? '<i class="ph ph-minus-circle"></i> Remove' : '<i class="ph ph-heart-straight"></i> Save'}
            </button>
        `;

        container.appendChild(card);
    });
}

function handleSaveToggle(id) {
    const existingMovie = savedMovies.find(item => item.imdbID === id);

    if (existingMovie) {
        savedMovies = savedMovies.filter(item => item.imdbID !== id);
    } else {
        const movieToSave = allSearchResults.find(item => item.imdbID === id);
        if (movieToSave) savedMovies.push(movieToSave);
    }

    localStorage.setItem("mySavedMovies", JSON.stringify(savedMovies));

    refreshSavedList();
    renderMoviesToScreen(allSearchResults);
}

function refreshSavedList() {
    const savedArea = document.getElementById("saved-items");
    savedArea.innerHTML = "";

    if (savedMovies.length === 0) {
        savedArea.innerHTML = `
            <div style="text-align: center; color: var(--text-dim); padding: 20px;">
                <i class="ph ph-mask-happy" style="font-size: 2rem; opacity: 0.5;"></i>
                <p>Your list is currently empty</p>
            </div>`;
        return;
    }

    savedMovies.forEach(movie => {
        const row = document.createElement("div");
        row.className = "saved-movie-row";

        row.innerHTML = `
            <div>
                <span>${movie.Title}</span>
                <small>${movie.Year}</small>
            </div>
            <button onclick="handleSaveToggle('${movie.imdbID}')">
                <i class="ph ph-trash"></i>
            </button>
        `;

        savedArea.appendChild(row);
    });
}

function sortByYear() {
    const sortedList = [...allSearchResults].sort((a, b) => b.Year - a.Year);
    renderMoviesToScreen(sortedList);
}

function filterLatest() {
    const latestOnly = allSearchResults.filter(movie => movie.Year >= 2015);
    renderMoviesToScreen(latestOnly);
}

function resetList() {
    renderMoviesToScreen(allSearchResults);
}

function createDelayedSearch(action, delayTime) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => action(...args), delayTime);
    };
}

const searchWithDelay = createDelayedSearch(loadMoviesFromApi, 500);

document.getElementById("movie-search").addEventListener("input", (event) => {
    searchWithDelay(event.target.value);
});

refreshSavedList();
renderMoviesToScreen(allSearchResults);