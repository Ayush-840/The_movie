import CONFIG from './config.js';

export const MovieAPI = {
    async searchMovies(query, page = 1) {
        try {
            const response = await fetch(`${CONFIG.BASE_URLS.OMDB}?apikey=${CONFIG.OMDB_API_KEY}&s=${query}&page=${page}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('OMDb Search Error:', error);
            return { Response: 'False', Error: 'Connectivity issues' };
        }
    },

    async getMovieDetails(id) {
        try {
            const response = await fetch(`${CONFIG.BASE_URLS.OMDB}?apikey=${CONFIG.OMDB_API_KEY}&i=${id}&plot=full`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('OMDb Detail Error:', error);
            return null;
        }
    },

    // TMDB Fallback/Trending Mock
    async getTrending() {
        // Since we don't have TMDB key, we use search results for '2024' or 'popular'
        return this.searchMovies('2024');
    }
};
