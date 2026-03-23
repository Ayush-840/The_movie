# 🎬 Movie Explorer — Web Application

> A dynamic movie discovery web application built with vanilla JavaScript and integrated with public movie APIs.  
> **Graded Individual Project | Newton School of Technology, ADY Patil University, Pune**  
> **Student:** Ayush Kumar

---

## 💡 Project Idea

### What is Movie Explorer?

**Movie Explorer** is a movie discovery web application that lets users search, explore, and save their favourite films — all in one place. It pulls live data from three public APIs to give users a complete picture: rich movie metadata, trending titles with high-quality posters, and real-time streaming availability (Netflix, Prime, Hotstar, etc.).

### The Problem It Solves
Users often struggle to find where a movie is streaming, or want to quickly compare ratings and discover similar films. Movie Explorer solves this by combining data from multiple sources into a single, clean interface.

### Who Is It For?
Anyone who loves movies — students, casual viewers, or enthusiasts who want to keep a personal watchlist and know exactly where to watch a title.

### Core User Stories

| # | As a user, I want to… | So that… |
|---|----------------------|----------|
| 1 | Search for any movie by name | I can quickly find information about it |
| 2 | Filter movies by genre or year | I can browse content I actually enjoy |
| 3 | Sort results by rating or release date | I can find the best or newest titles first |
| 4 | See which streaming platforms carry a movie | I don't waste time searching multiple apps |
| 5 | Save movies to a Favourites list | I can build a personal watchlist |
| 6 | Switch between dark and light mode | I can use the app comfortably at any time |

### Data Flow Diagram

```
User types movie name
       │
       ▼
  OMDb API  ──────► Movie details (title, year, rating, plot, poster)
       │
       ▼
  TMDB API  ──────► Trending movies, genres, high-res posters
       │
       ▼
Watchmode API ───► Streaming sources (Netflix, Prime Video, Hotstar…)
       │
       ▼
   UI renders cards with all combined information
```

---

## 📌 Project Overview

**Movie Explorer** is a feature-rich web application that lets users search, filter, and sort movies in real time using data fetched from public movie APIs. The app provides detailed information about movies — including ratings, genres, release year, cast, and streaming availability — all in a clean, responsive interface.

---

## 🌐 APIs Used

### 1. 🎥 OMDb API — Open Movie Database
- **Base URL:** `https://www.omdbapi.com/`
- **Docs:** [omdbapi.com](https://www.omdbapi.com/)
- **Auth:** Free API key (register at omdbapi.com)

| Endpoint | Usage |
|----------|-------|
| `?s={title}&apikey={key}` | Search movies by title (returns list) |
| `?i={imdbID}&apikey={key}` | Fetch full details by IMDb ID |
| `?t={title}&y={year}&apikey={key}` | Fetch a specific movie by exact title |

**Data provided:** Title, Year, Rated, Genre, Director, Actors, Plot, IMDb Rating, Poster URL, Awards

```js
// Example fetch
const res = await fetch(`https://www.omdbapi.com/?s=Inception&apikey=${OMDB_KEY}`);
const data = await res.json();
// data.Search → array of movie results
```

---

### 2. 🎞️ TMDB API — The Movie Database
- **Base URL:** `https://api.themoviedb.org/3/`
- **Docs:** [developer.themoviedb.org](https://developer.themoviedb.org/docs/getting-started)
- **Auth:** Bearer Token (free account at themoviedb.org)

| Endpoint | Usage |
|----------|-------|
| `trending/movie/week` | Get trending movies this week |
| `movie/popular` | Get currently popular movies |
| `genre/movie/list` | Get all genre IDs and names |
| `search/movie?query={title}` | Search movies by name |
| `movie/{id}` | Full movie details by TMDB ID |

**Data provided:** Poster & backdrop images, genres array, vote average, popularity score, overview

```js
// Example fetch
const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week`, {
  headers: { Authorization: `Bearer ${TMDB_KEY}` }
});
const data = await res.json();
// data.results → array of trending movies
// Poster image: `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`
```

---

### 3. 📺 Watchmode API — Streaming Availability
- **Base URL:** `https://api.watchmode.com/v1/`
- **Docs:** [api.watchmode.com](https://api.watchmode.com/)
- **Auth:** Free API key (register at watchmode.com)

| Endpoint | Usage |
|----------|-------|
| `search/?search_field=name&search_value={title}` | Find a title's Watchmode ID |
| `title/{id}/sources/` | Get streaming platforms for a title |

**Data provided:** Source name (Netflix, Prime Video, Hotstar), type (subscription/free/rent/buy), web URL

```js
// Example fetch
const res = await fetch(
  `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_KEY}`
);
const sources = await res.json();
// sources → [{name: "Netflix", type: "sub", web_url: "..."}]
```

---

### API Summary Table

| API | Free Tier Limit | Key Data Used |
|-----|----------------|---------------|
| OMDb | 1,000 req/day | Title, Rating, Plot, Poster |
| TMDB | ~40 req/10 sec | Trending, Genres, HD Posters |
| Watchmode | 1,000 req/month | Streaming platform sources |

---

## ✨ Planned Features

### Core Features (Milestones 2 & 3)
- 🔍 **Search** — Real-time movie search using Array HOFs (`filter`, `find`)
- 🎭 **Filter by Genre** — Filter results by genre using `.filter()`
- 📊 **Sort** — Sort movies by rating, release year, or title using `.sort()`
- ❤️ **Favorites** — Like/save movies to a personal list (stored in LocalStorage)
- 🌙 **Dark / Light Mode** — Theme toggle with preference saved in LocalStorage
- 📡 **Streaming Info** — Show which platforms each movie is available on

### Bonus Features (Optional)
- ⏳ **Debouncing** — Prevents excessive API calls on each keystroke in the search bar
- 📄 **Pagination** — Splits large result sets into pages
- 💾 **Local Storage** — Persists favorites and dark mode preference across sessions
- 🔄 **Loading Indicators** — Spinner shown during API fetch calls

---

## 🛠️ Technologies Used

| Technology | Role |
|-----------|------|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, responsive layout, dark/light themes |
| Vanilla JavaScript (ES6+) | Logic, API calls (`fetch`), Array HOFs |
| OMDb API | Movie data source |
| TMDB API | Trending movies & poster images |
| Watchmode API | Streaming availability |

> 💡 No frameworks or build tools — pure HTML/CSS/JS as required.

---

## 📁 Project Structure

```
The_movie/
├── index.html          # Main HTML page
├── style.css           # Stylesheet (themes, responsive design)
├── app.js              # Core JavaScript (API integration, HOFs, UI)
├── README.md           # Project documentation
└── assets/             # Icons, images (if any)
```

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/The_movie.git
   cd The_movie
   ```

2. **Add your API keys**  
   Open `app.js` and replace the placeholder values:
   ```js
   const OMDB_KEY    = "your_omdb_api_key";
   const TMDB_KEY    = "your_tmdb_api_key";
   const WATCHMODE_KEY = "your_watchmode_api_key";
   ```

3. **Open in browser**  
   Simply open `index.html` in any modern browser — no build step needed.
   ```bash
   open index.html   # macOS
   # or drag-and-drop into Google Chrome
   ```

---

## 📅 Milestone Progress

| Milestone | Description | Deadline | Status |
|-----------|-------------|----------|--------|
| ✅ **M1** | Project Setup, GitHub repo, README | 23rd March | Done |
| 🔄 **M2** | API Integration, Responsive UI | 1st April | In Progress |
| ⬜ **M3** | Search, Filter, Sort (using HOFs) | 8th April | Upcoming |
| ⬜ **M4** | Documentation, Refactor, Deployment | 10th April | Upcoming |

---

## 📋 Array HOFs Usage Plan

| Feature | HOF Used |
|---------|----------|
| Search movies by title | `Array.filter()` |
| Filter by genre | `Array.filter()` |
| Sort by rating / year | `Array.sort()` |
| Map API data to UI cards | `Array.map()` |
| Find a specific movie | `Array.find()` |
| Count favorites | `Array.reduce()` |

> ⚠️ Traditional `for` / `while` loops will **not** be used for these operations.

---

## ✅ Best Practices Followed

- Meaningful variable and function names
- Modular code — API logic, UI rendering, and event handling separated
- Error handling for API calls (network errors, empty results)
- Responsive design tested across mobile, tablet, and desktop
- Regular commits with descriptive messages
- LocalStorage for persistence (favorites, theme)
- Debouncing on the search input for performance

---

## 🔗 Deployment

The project will be deployed using **GitHub Pages** / **Netlify** after Milestone 4.  
Live link will be added here upon deployment.

---

## 👤 Author

**Ayush Kumar**  
Newton School of Technology | ADY Patil University, Pune  
Academic Year 2025–26
