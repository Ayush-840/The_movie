const Watchlist = {
    get() {
        return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.WATCHLIST)) || [];
    },

    save(watchlist) {
        localStorage.setItem(window.CONFIG.STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    },

    add(movie) {
        const watchlist = this.get();
        if (!watchlist.find(m => m.imdbID === movie.imdbID)) {
            watchlist.push(movie);
            this.save(watchlist);
            return true;
        }
        return false;
    },

    remove(id) {
        let watchlist = this.get();
        const initialLength = watchlist.length;
        watchlist = watchlist.filter(m => m.imdbID !== id);
        this.save(watchlist);
        return watchlist.length < initialLength;
    },

    toggle(movie) {
        const id = typeof movie === 'string' ? movie : movie.imdbID;
        const watchlist = this.get();
        const index = watchlist.findIndex(m => m.imdbID === id);

        if (index > -1) {
            watchlist.splice(index, 1);
            this.save(watchlist);
            return 'removed';
        } else {
            if (typeof movie !== 'string') {
                watchlist.push(movie);
                this.save(watchlist);
                return 'added';
            }
            return 'error';
        }
    }
};

window.Watchlist = Watchlist;
