import React, { useState } from "react";
import { search } from "../api";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await search({ query });
      setResults(resp.results);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="search-page">
      <h2>Search Dashboard Data</h2>
      <form onSubmit={doSearch}>
        <input
          value={query}
          type="text"
          placeholder="Search analytics, threats, notifications..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <ul className="search-results">
        {results.length === 0 && !loading && <li>No results</li>}
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.result_type}:</strong>{" "}
            <span>
              {typeof r.content === "object"
                ? JSON.stringify(r.content)
                : r.content}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchPage;
