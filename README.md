# 🎬 Movie Explorer

> A movie discovery web app built with HTML, CSS & Vanilla JavaScript  
> **Graded Individual Project | Newton School of Technology, ADY Patil University, Pune**  
> **Student:** Ayush Kumar &nbsp;|&nbsp; Academic Year 2025–26

---

## 💡 Project Idea

### Concept
**Movie Explorer** is a one-stop movie discovery platform. Users can search for any movie, filter by genre or year, sort by rating, and instantly see which streaming services carry it — all without leaving the app.

### The Problem It Solves
People waste time jumping between Netflix, Prime, Hotstar and Google just to find where a movie is streaming and whether it's worth watching. Movie Explorer brings all that information together in a single, clean interface.

### Key Idea in One Line
> *"Search any movie → see its details, rating, and where to stream it — all at once."*

### User Stories

| # | I want to… | So that… |
|---|-----------|----------|
| 1 | Search movies by name | I find info instantly |
| 2 | Filter by genre / year | I browse content I like |
| 3 | Sort by rating or release date | I discover the best first |
| 4 | See streaming platforms per title | I know exactly where to watch |
| 5 | Save movies to Favourites | I build a personal watchlist |
| 6 | Toggle Dark / Light mode | I use the app at any time |

### How the APIs Work Together

```
User searches "Inception"
         │
         ├──► OMDb API       → Title, Rating, Plot, Cast, Poster
         │
         ├──► TMDB API       → HD Poster, Genre tags, Popularity score
         │
         └──► Watchmode API  → Netflix / Prime / Hotstar availability
                                        │
                              Rendered as a Movie Card in the UI
```

---

## 📌 Project Overview

**Movie Explorer** fetches and displays real-time movie data using three public APIs. It implements search, filtering, and sorting entirely with JavaScript Array HOFs (`filter`, `map`, `sort`, `find`, `reduce`) — no `for`/`while` loops.

---

## 🌐 APIs Used

### 1. 🎥 OMDb API — Open Movie Database
- **Base URL:** `https://www.omdbapi.com/`
- **Docs:** [omdbapi.com](https://www.omdbapi.com/)
- **Auth:** Free API key

| Endpoint | Purpose |
|----------|---------|
| `?s={title}&apikey={key}` | Search movies by title |
| `?i={imdbID}&apikey={key}` | Full details by IMDb ID |
| `?t={title}&y={year}&apikey={key}` | Movie by exact title + year |

**Returns:** Title, Year, Genre, Director, Actors, Plot, IMDb Rating, Poster URL, Awards

```js
const res  = await fetch(`https://www.omdbapi.com/?s=Inception&apikey=${OMDB_KEY}`);
const data = await res.json();
// data.Search → array of matching movies
```

---

### 2. 🎞️ TMDB API — The Movie Database
- **Base URL:** `https://api.themoviedb.org/3/`
- **Docs:** [developer.themoviedb.org](https://developer.themoviedb.org/docs/getting-started)
- **Auth:** Bearer Token (free account)

| Endpoint | Purpose |
|----------|---------|
| `trending/movie/week` | Trending movies this week |
| `movie/popular` | Currently popular movies |
| `genre/movie/list` | All genre IDs and names |
| `search/movie?query={title}` | Search by name |

**Returns:** HD Poster paths, Backdrop images, Genre list, Vote average, Popularity

```js
const res  = await fetch(`https://api.themoviedb.org/3/trending/movie/week`, {
  headers: { Authorization: `Bearer ${TMDB_KEY}` }
});
const data = await res.json();
// Poster: `https://image.tmdb.org/t/p/w500` + data.results[0].poster_path
```

---

### 3. 📺 Watchmode API — Streaming Availability
- **Base URL:** `https://api.watchmode.com/v1/`
- **Docs:** [api.watchmode.com](https://api.watchmode.com/)
- **Auth:** Free API key

| Endpoint | Purpose |
|----------|---------|
| `search/?search_field=name&search_value={title}` | Get Watchmode title ID |
| `title/{id}/sources/` | Streaming platforms for that title |

**Returns:** Platform name (Netflix, Prime, Hotstar), type (sub/free/rent/buy), direct URL

```js
const res     = await fetch(`https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${WATCHMODE_KEY}`);
const sources = await res.json();
// [{name:"Netflix", type:"sub", web_url:"..."}]
```

---

### API Quick Reference

| API | Free Limit | Primary Data |
|-----|-----------|-------------|
| OMDb | 1,000 req/day | Title, Rating, Plot, Poster |
| TMDB | ~40 req/10 sec | Trending, Genres, HD Images |
| Watchmode | 1,000 req/month | Streaming platform sources |

---

## ✨ Features

### Core
- 🔍 **Search** — real-time movie search (`Array.filter`)
- 🎭 **Filter by Genre / Year** — (`Array.filter`)
- 📊 **Sort** — by rating, year, or title (`Array.sort`)
- ❤️ **Favourites** — save movies to a watchlist (LocalStorage)
- 🌙 **Dark / Light Mode** — theme toggle (LocalStorage)
- 📡 **Streaming Info** — see which platforms carry each title

### Bonus
- ⏳ **Debouncing** on search input — reduces unnecessary API calls
- 📄 **Pagination** — for large result sets
- 🔄 **Loading Spinner** — shown during API fetch

---

## 🛠️ Tech Stack

| Technology | Role |
|-----------|------|
| HTML5 | Page structure |
| CSS3 | Styling, responsive layout, dark/light themes |
| Vanilla JavaScript (ES6+) | Logic, `fetch`, Array HOFs |
| OMDb API | Movie metadata |
| TMDB API | Trending data + HD posters |
| Watchmode API | Streaming availability |

> 💡 Pure HTML/CSS/JS — no frameworks or build tools.

---

## 📁 Project Structure

```
The_movie/
├── index.html      # Main HTML page
├── style.css       # Stylesheet (themes, responsive layout)
├── app.js          # API calls, HOFs, UI rendering
├── README.md       # Project documentation
└── assets/         # Icons and static images
```

---

## 🚀 Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/The_movie.git
cd The_movie

# 2. Add your API keys in app.js
const OMDB_KEY      = "your_omdb_key";
const TMDB_KEY      = "your_tmdb_bearer_token";
const WATCHMODE_KEY = "your_watchmode_key";

# 3. Open in browser — no build step needed
open index.html
```

---

## 📅 Milestone Progress

| Milestone | Goal | Deadline | Status |
|-----------|------|----------|--------|
| ✅ M1 | Project setup, GitHub repo, README | 23 Mar | **Done** |
| 🔄 M2 | API integration, responsive UI | 1 Apr | In Progress |
| ⬜ M3 | Search / Filter / Sort (HOFs) | 8 Apr | Upcoming |
| ⬜ M4 | Refactor, deploy, final docs | 10 Apr | Upcoming |

---

## 📋 Array HOFs Plan

| Feature | HOF |
|---------|-----|
| Search by title | `filter()` |
| Filter by genre/year | `filter()` |
| Sort by rating/date | `sort()` |
| Render movie cards | `map()` |
| Find a specific movie | `find()` |
| Count favourites | `reduce()` |

> ⚠️ No `for` or `while` loops used for these operations.

---

## ✅ Best Practices

- Modular code — API, UI, and event logic separated
- Descriptive variable and function names
- Error handling for all API calls
- Responsive across mobile, tablet, and desktop
- Regular, meaningful git commits
- DRY principle — reusable functions throughout

---

## 🔗 Deployment

Will be deployed via **GitHub Pages / Netlify** after Milestone 4.  
Live link: _(to be added)_

---

## 👤 Author

**Ayush Kumar** — Newton School of Technology, ADY Patil University, Pune
