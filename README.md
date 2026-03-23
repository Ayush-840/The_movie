# 🎬 Movie Explorer

A web app where you can search for any movie, see its ratings and details, and instantly find out which streaming platform it's on — Netflix, Prime, Hotstar, you name it.

> **Graded Individual Project** | Newton School of Technology, ADY Patil University, Pune  
> **Student:** Ayush Kumar | Academic Year 2025–26

---

## 💡 The Idea

We've all been there — you hear about a movie, you Google it, then you check Netflix, then Prime, then Hotstar... just to find out where it's streaming. It's annoying.

**Movie Explorer** fixes that. Search once, get everything — the plot, the IMDb rating, the cast, and exactly where you can watch it right now.

### What you can do with it

- 🔍 **Search** any movie by name
- 🎭 **Filter** by genre or release year
- 📊 **Sort** by rating, title, or date
- ❤️ **Save favourites** to come back to later
- 📺 **See streaming availability** (Netflix, Prime, Hotstar, etc.)
- 🌙 **Switch between Dark and Light mode**

---

## 🌐 APIs I'm Using

### 1. OMDb API — [omdbapi.com](https://www.omdbapi.com/)
Gives me the core movie info — title, year, genre, plot, IMDb rating, poster, cast, awards.

```
Base URL: https://www.omdbapi.com/
Auth: Free API key

Key endpoints:
  ?s={title}&apikey={key}         → search by name
  ?i={imdbID}&apikey={key}        → full details by IMDb ID
```

```js
const res  = await fetch(`https://www.omdbapi.com/?s=Inception&apikey=${OMDB_KEY}`);
const data = await res.json();
// data.Search → list of matching movies
```

---

### 2. TMDB API — [developer.themoviedb.org](https://developer.themoviedb.org/docs/getting-started)
Great for trending movies, genre lists, and high-quality poster images.

```
Base URL: https://api.themoviedb.org/3/
Auth: Bearer Token (free account)

Key endpoints:
  trending/movie/week             → what's trending right now
  movie/popular                   → currently popular
  genre/movie/list                → all genres with IDs
  search/movie?query={title}      → search by name
```

```js
const res  = await fetch(`https://api.themoviedb.org/3/trending/movie/week`, {
  headers: { Authorization: `Bearer ${TMDB_KEY}` }
});
// Poster: https://image.tmdb.org/t/p/w500 + result.poster_path
```

---

### 3. Watchmode API — [api.watchmode.com](https://api.watchmode.com/)
Tells me exactly which platforms are streaming a specific movie.

```
Base URL: https://api.watchmode.com/v1/
Auth: Free API key

Key endpoints:
  search/?search_field=name&search_value={title}   → get Watchmode ID
  title/{id}/sources/                              → streaming platforms
```

```js
const res  = await fetch(`https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${WATCHMODE_KEY}`);
const sources = await res.json();
// [{name: "Netflix", type: "sub", web_url: "..."}]
```

---

### API Limits (Free Tier)

| API       | Limit              |
|-----------|--------------------|
| OMDb      | 1,000 req / day    |
| TMDB      | ~40 req / 10 sec   |
| Watchmode | 1,000 req / month  |

---

## 🛠️ Tech Stack

| What       | Why                              |
|------------|----------------------------------|
| HTML5      | Page structure                   |
| CSS3       | Styling + dark/light themes      |
| JavaScript | Logic, `fetch`, Array HOFs       |

No frameworks, no build tools — pure HTML/CSS/JS as required.

---

## 📁 Project Structure

```
The_movie/
├── index.html      ← main page
├── style.css       ← styling + themes
├── app.js          ← API calls, HOFs, UI rendering
└── README.md       ← you're reading it
```

---

## 🚀 Running It Locally

```bash
git clone https://github.com/Ayush-840/The_movie.git
cd The_movie
```

Add your API keys in `app.js`:
```js
const OMDB_KEY      = "your_omdb_key";
const TMDB_KEY      = "your_tmdb_bearer_token";
const WATCHMODE_KEY = "your_watchmode_key";
```

Then just open `index.html` in a browser. Done.

---

## 📅 Milestones

| # | What | Deadline | Status |
|---|------|----------|--------|
| M1 | Project setup + README | 23 Mar | ✅ Done |
| M2 | API integration + responsive UI | 1 Apr | 🔄 In Progress |
| M3 | Search / Filter / Sort (HOFs) | 8 Apr | ⬜ Upcoming |
| M4 | Refactor + deploy | 10 Apr | ⬜ Upcoming |

---

## 📋 Array HOFs I'll Use

| Feature | HOF |
|---------|-----|
| Search by title | `filter()` |
| Filter by genre / year | `filter()` |
| Sort results | `sort()` |
| Render movie cards | `map()` |
| Find one specific movie | `find()` |
| Count favourites | `reduce()` |

No `for` or `while` loops for any of these — just HOFs.

---

## 🔗 Deployment

Will be live on GitHub Pages / Netlify after Milestone 4. Link coming soon.

---

**Ayush Kumar** — Newton School of Technology, ADY Patil University, Pune
