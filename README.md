# CineVault — Movie Watchlist App

## Overview

CineVault is a movie search and watchlist web application built using JavaScript. Users can search for movies, view details, and save them to a personal watchlist.

---

## API Used

OMDb API
https://www.omdbapi.com/

---

## Features

## 🚀 Milestones Status

| Milestone | Goal | Status | Deadline |
| --- | --- | --- | --- |
| **M1** | Project Setup & README | ✅ Done | 23rd March |
| **M2** | API Integration (fetch) | ✅ Done | 1st April |
| **M3** | Core Features (HOFs) | ✅ Done | 8th April |
| **M4** | Refactoring & Deployment | ✅ Done | 10th April |

## ✨ Key Features Implemented

### 🌐 Milestone 2: API Integration
- **Multiple API Sources**: Real-time data fetched using `fetch` from **OMDb**, **TMDB**, and **Watchmode**.
- **Dynamic Display**: Interactive grid layout that updates instantly with fetched data.
- **Loading States**: Aesthetic loading spinners and skeleton-like states for smooth UX.
- **Fully Responsive**: Mobile-first design using CSS Grid and Flexbox.

### ⚙️ Milestone 3: Core Features (Powered by Array HOFs)
- **Live Search**: Find any movie using keywords (implemented with `.filter()` in mock mode).
- **Genre Filtering**: Filter results by categories (Action, Comedy, etc.) using `.filter()`.
- **Advanced Sorting**: Arrange movies by Rating, Release Year, or Title using `.sort()`.
- **Watchlist System**: Save favorites to a list (persisted via `localStorage`) using `.findIndex()` and `.map()`.
- **Theme Toggle**: Switch between a premium Dark (Obsidian Red) and Light mode.

### ⭐ Bonus Features (Advanced)
- **Debouncing**: Search API calls are throttled as you type to improve performance.
- **Pagination**: "Load More" functionality to navigate through OMDb search results.
- **Mock Fallback**: A sophisticated mock data system that allows testing even without API keys.
- **Settings UI**: Manage your API keys directly in the browser for a professional experience.
* Empty state messages for no results

---

## Technologies Used

* HTML
* CSS
* JavaScript
* Fetch API
* Local Storage

---

## Project Structure

```
cinevault/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── api.js
│   ├── ui.js
│   ├── watchlist.js
│   └── app.js
└── README.md
```

---

## Setup

1. Clone the repository
   git clone https://github.com/Ayush-840/The_movie

2. Get API key from OMDb

3. Replace API key in config.js

4. Open index.html in browser

---

## Author

Ayush Kumar
