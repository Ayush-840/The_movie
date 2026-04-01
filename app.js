const omdbKey = "a35e86be";
let allSearchResults = [];
let savedMovies = JSON.parse(localStorage.getItem("mySavedMovies")) || [];

// 🚀 Start Search
async function loadMoviesFromApi(query) {
    const listDisplay = document.getElementById("movie-display");

    if (!query) {
        listDisplay.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px 0; opacity: 0.5;">
                <i class="ph ph-film-slate" style="font-size: 4rem; display: block; margin-bottom: 20px;"></i>
                <p style="font-size: 1.2rem;">Start your cinematic journey by searching above.</p>
            </div>`;
        return;
    }

    // 🦴 Show Skeletons
    renderSkeletons();

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${omdbKey}&s=${query}`);
        const data = await response.json();

        if (data.Search) {
            allSearchResults = data.Search;
            renderMoviesToScreen(allSearchResults);
        } else {
            listDisplay.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No stories found matching "${query}".</p>`;
        }
    } catch (error) {
        listDisplay.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--neon-crimson); padding: 50px;">Network error. Please check your connection.</p>`;
    }
}

// 🦴 Render Loading Skeletons
function renderSkeletons() {
    const container = document.getElementById("movie-display");
    container.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card";
        container.appendChild(skeleton);
    }
}

// 🎞️ Render Movies
function renderMoviesToScreen(movies) {
    const container = document.getElementById("movie-display");
    container.innerHTML = "";

    movies.forEach(movie => {
        const isSaved = savedMovies.find(item => item.imdbID === movie.imdbID);
        const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600?text=No+Poster+Found";

        const card = document.createElement("div");
        card.className = "single-movie-card";

        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${posterUrl}" loading="lazy" alt="${movie.Title}"/>
                <div class="card-overlay">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <button onclick="handleSaveToggle('${movie.imdbID}')">
                        ${isSaved ? '<i class="ph ph-minus-circle"></i> Remove' : '<i class="ph ph-plus-circle"></i> Add to List'}
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// ❤️ Handle Save
function handleSaveToggle(id) {
    const existingIndex = savedMovies.findIndex(item => item.imdbID === id);

    if (existingIndex > -1) {
        savedMovies.splice(existingIndex, 1);
    } else {
        const movieToSave = allSearchResults.find(item => item.imdbID === id);
        if (movieToSave) savedMovies.push(movieToSave);
    }

    localStorage.setItem("mySavedMovies", JSON.stringify(savedMovies));
    refreshSavedList();
    renderMoviesToScreen(allSearchResults);
}

// 📌 Refresh Sidebar
function refreshSavedList() {
    const savedArea = document.getElementById("saved-items");
    savedArea.innerHTML = "";

    if (savedMovies.length === 0) {
        savedArea.innerHTML = `<p style="text-align: center; opacity: 0.3; padding: 40px;">No movies saved.</p>`;
        return;
    }

    savedMovies.forEach(movie => {
        const row = document.createElement("div");
        row.className = "saved-movie-row";
        row.innerHTML = `
            <div>
                <span style="display: block; font-weight: 600;">${movie.Title}</span>
                <small style="color: var(--text-muted);">${movie.Year}</small>
            </div>
            <button style="background: none; border: none; color: var(--neon-crimson); font-size: 1.2rem; cursor: pointer;" onclick="handleSaveToggle('${movie.imdbID}')">
                <i class="ph ph-trash-simple"></i>
            </button>
        `;
        savedArea.appendChild(row);
    });
}

// 🎚️ Drawer Toggle
function toggleSavedDrawer() {
    document.getElementById("side-saved-list").classList.toggle("active");
}

// 🔃 Sorting
function sortByYear() {
    const sorted = [...allSearchResults].sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    renderMoviesToScreen(sorted);
}

function filterLatest() {
    const latest = allSearchResults.filter(m => parseInt(m.Year) >= 2020);
    renderMoviesToScreen(latest);
}

function resetList() {
    renderMoviesToScreen(allSearchResults);
}

// ⚡ Debounced Search
function createSearchDelay(fn, ms) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

const performSearch = createSearchDelay(loadMoviesFromApi, 600);

document.getElementById("movie-search").addEventListener("input", (e) => {
    performSearch(e.target.value);
});

// 🎬 Init
refreshSavedList();
loadMoviesFromApi("");