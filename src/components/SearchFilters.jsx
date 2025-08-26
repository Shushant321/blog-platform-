import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/SearchFilters.css';

const SearchFilters = ({ onSearch, onFilter, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'all', 'technology', 'lifestyle', 'travel', 'food', 
    'health', 'business', 'education', 'entertainment', 'sports'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest' },
    { value: 'trending', label: 'Trending' },
    { value: 'likesCount', label: 'Most Liked' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'title', label: 'Title A-Z' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    onFilter(newCategory);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onSort(newSort);
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>

      <button 
        className="filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={20} />
        Filters
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;