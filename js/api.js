const MovieAPI = {
    async searchMovies(query, page = 1) {
        try {
            const response = await fetch(`${window.CONFIG.BASE_URLS.OMDB}?apikey=${window.CONFIG.OMDB_API_KEY}&s=${query}&page=${page}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('OMDb Search Error:', error);
            return { Response: 'False', Error: 'Connectivity issues' };
        }
    },

    async fetchMultiple(queries) {
        const results = await Promise.all(queries.map(q => this.searchMovies(q, 1)));
        const combined = results
            .filter(r => r.Response === 'True')
            .flatMap(r => r.Search);
        
        // Return unique movies by imdbID
        return [...new Map(combined.map(item => [item.imdbID, item])).values()];
    },

    async getMovieDetails(id) {
        try {
            const response = await fetch(`${window.CONFIG.BASE_URLS.OMDB}?apikey=${window.CONFIG.OMDB_API_KEY}&i=${id}&plot=full`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('OMDb Detail Error:', error);
            return null;
        }
    },

    async getTrending() {
        return this.fetchMultiple(['Batman', 'Dune', 'Avengers', 'Horror', 'Action']);
    }
};

window.MovieAPI = MovieAPI;
