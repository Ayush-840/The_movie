const UI = {
    renderMovieCards(movies, container) {
        container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    },

    createMovieCard(movie) {
        const hasPoster = movie.Poster && movie.Poster !== 'N/A';
        const fallbackPoster = 'https://via.placeholder.com/300x450/1b1e20/666666?text=Poster+Not+Available';
        const posterUrl = hasPoster ? movie.Poster : fallbackPoster;
        const posterHtml = `<img src="${posterUrl}" alt="${movie.Title}" loading="lazy" class="movie-poster" onerror="this.onerror=null; this.src='${fallbackPoster}';">`;
               
        const isLatest = parseInt(movie.Year) >= 2024;
        
        // Handle rating if available, otherwise show "Rating Pending"
        const ratingHtml = movie.imdbRating && movie.imdbRating !== 'N/A' 
            ? `<span class="card-rating"><i class="ph-fill ph-star gold-star"></i> ${movie.imdbRating}</span>`
            : `<span class="rating-unknown">Rating Pending</span>`;

        return `
            <div class="movie-card" data-id="${movie.imdbID}">
                <div class="year-badge">${movie.Year || 'N/A'}</div>
                ${isLatest ? '<div class="featured-badge">FEATURED</div>' : ''}
                <div class="poster-wrapper">
                    ${posterHtml}
                </div>
                <div class="card-overlay">
                    <h3 class="card-title" title="${movie.Title}">${movie.Title}</h3>
                    <div class="card-meta">
                        <span class="muted-text">🎬 ${movie.Type ? movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1) : 'Movie'}</span>
                        ${ratingHtml}
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
