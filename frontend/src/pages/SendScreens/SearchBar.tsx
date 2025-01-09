
import React, { FC, FormEventHandler } from 'react';

interface SearchBarProps {
    handleSearch: FormEventHandler<HTMLFormElement>; 
    setQuery: (query: string) => void;
    query: string; 
  }
  
  const SearchBar: FC<SearchBarProps> = ({ handleSearch, setQuery, query }) => {
  return (
    <div id="search-bar">
      <h4 id="screen-share-title">Screen Share</h4>
      <form onSubmit={handleSearch} id="search-input-form">
        <input
          id="search-input"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="  Search Images"
          value={query}
        />
      </form>
    </div>
  );
}

export default SearchBar;