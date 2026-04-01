const UI = {
    renderMovieCards(movies, container) {
        container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    },

    createMovieCard(movie) {
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
        const isLatest = parseInt(movie.Year) >= 2024;
        return `
            <div class="movie-card" data-id="${movie.imdbID}">
                <div class="year-badge">${movie.Year}</div>
                ${isLatest ? '<div class="featured-badge">FEATURED</div>' : ''}
                <img src="${poster}" alt="${movie.Title}" loading="lazy">
                <div class="card-overlay">
                    <h3 class="card-title" title="${movie.Title}">${movie.Title}</h3>
                    <div class="card-meta">
                        <span>🎬 Movie</span>
                        <span>⭐ N/A</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-watchlist" onclick="window.handleWatchlistToggle('${movie.imdbID}')">
                        <i class="ph ph-plus"></i> Watchlist
                    </button>
                    <button class="btn-details" onclick="window.showDetails('${movie.imdbID}')">
                        <i class="ph ph-info"></i> Details
                    </button>
                </div>
            </div>
        `;
    },

    renderSkeletons(container, count = 10) {
        container.innerHTML = Array(count).fill(0).map(() => `
            <div class="movie-card skeleton" style="height: 350px;"></div>
        `).join('');
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    renderGenrePills(genres, container, activeGenre) {
        container.innerHTML = genres.map(genre => `
            <button class="pill ${genre === activeGenre ? 'active' : ''}" onclick="window.handleGenreChange('${genre}')">
                ${genre}
            </button>
        `).join('');
    }
};

window.UI = UI;
