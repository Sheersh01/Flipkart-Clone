import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import flipkartLogo from "../assets/home/topNav/flipkart.png";
import flipkartIcon from "../assets/home/topNav/flipkartIcon.png";
import "./SearchNav.css";

import SearchNavActions from "./SearchNavActions";

function SearchNav({ showActions = false, showBrandButton = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSearchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || params.get("search") || "";
  }, [location.search]);
  const [query, setQuery] = useState(currentSearchQuery);

  useEffect(() => {
    setQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      navigate("/");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="search-nav" id="search-nav">
      <div className="container search-nav-inner">
        {showBrandButton ? (
          <Link
            to="/"
            className="search-nav-brand-pill"
            id="search-nav-brand-pill"
            aria-label="Go to home"
          >
            <img
              src={flipkartIcon}
              alt="Flipkart"
              className="search-nav-brand-icon"
            />
            <img
              src={flipkartLogo}
              alt="Flipkart"
              className="search-nav-brand-text"
            />
            <svg
              className="search-nav-brand-caret"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ) : null}

        <form
          className="search-bar"
          id="search-bar"
          onSubmit={handleSearchSubmit}
        >
          <svg
            className="search-bar-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#9E9E9E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#9E9E9E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search for Products, Brands and More"
            id="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search products and brands"
          />
        </form>
        {showActions ? (
          <div className="search-nav-actions">
            <SearchNavActions />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchNav;
