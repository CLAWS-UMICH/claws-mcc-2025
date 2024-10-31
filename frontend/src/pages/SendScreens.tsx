import { useState } from 'react';
import './SendScreens.css';

function SendScreens() {
  const [query, setQuery] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    alert("Clicked search with: " + query);
  }

  return (
    <div id="container">
      <div id="search-bar">
        <h4 id="screen-share-title">Screen Share</h4>
        <form onSubmit={search} id="search-input-form">
          <input 
            id="search-input"
            type="text" 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="  Search Images" 
            value={query}
          />
        </form>
      </div>
    </div>
  );
}

export default SendScreens;
