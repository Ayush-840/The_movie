import React, { useState } from 'react';
import './CinematicHero.css';

const CinematicHero = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    console.log('Searching for:', searchValue);
    // Add routing or search logic here
  };

  const trendingSearches = ['Dune: Part Two', 'Oppenheimer', 'Interstellar', 'The Batman'];

  return (
    <section className="hero-container">
      {/* Deep linear gradient overlay */}
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">Discover The Extraordinary</h1>
        
        <form className="search-wrapper" onSubmit={handleSearch}>
          <svg 
            className="search-icon" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for movies, series, or actors..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="trending-tags">
          <span className="trending-label">Trending:</span>
          {trendingSearches.map((term, index) => (
            <button 
              key={index} 
              className="trending-chip"
              onClick={() => setSearchValue(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
