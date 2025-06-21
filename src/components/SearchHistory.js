import React from 'react';
import './SearchHistory.css';

const SearchHistory = ({ history, onSelect }) => {
  return (
    <div className="search-history">
      <h3>📜 Search History</h3>
      {history.length === 0 ? (
        <p className="empty">No recent searches.</p>
      ) : (
        <ul>
          {history.map((city, index) => (
            <li key={index}>
              <button onClick={() => onSelect(city)}>{city}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchHistory;
