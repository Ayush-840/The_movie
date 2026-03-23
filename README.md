# 🎬 Movie Explorer — Web Application

> A dynamic movie discovery web application built with vanilla JavaScript and integrated with public movie APIs.  
> **Graded Individual Project | Newton School of Technology, ADY Patil University, Pune**  
> **Student:** Ayush Kumar

---

## 📌 Project Overview

**Movie Explorer** is a feature-rich web application that lets users search, filter, and sort movies in real time using data fetched from public movie APIs. The app provides detailed information about movies — including ratings, genres, release year, cast, and streaming availability — all in a clean, responsive interface.

---

## 🌐 APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| **OMDb API** | Movie search, ratings, plot, and metadata | [omdbapi.com](https://www.omdbapi.com/) |
| **The Movie Database (TMDB)** | Trending movies, genres, poster images | [developer.themoviedb.org](https://developer.themoviedb.org/docs/getting-started) |
| **Watchmode API** | Streaming platform availability per title | [api.watchmode.com](https://api.watchmode.com/) |

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
