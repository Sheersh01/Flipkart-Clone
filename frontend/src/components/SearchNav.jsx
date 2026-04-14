import profileIcon from '../assets/home/searchNavSide/profile-6bae67.svg';
import cartIcon from '../assets/home/searchNavSide/header_cart_v4-6ac9a8.svg';
import './SearchNav.css';

function SearchNav() {
  return (
    <div className="search-nav" id="search-nav">
      <div className="container search-nav-inner">
        <div className="search-bar" id="search-bar">
          <svg className="search-bar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search for Products, Brands and More"
            id="search-input"
          />
        </div>
        <div className="search-nav-actions">
          <a href="#" className="search-nav-action" id="profile-btn">
            <img src={profileIcon} alt="Profile" className="search-nav-action-icon" />
            <span className="search-nav-action-label">vinod</span>
            <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#" className="search-nav-action" id="more-btn">
            <span className="search-nav-action-label">More</span>
            <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#" className="search-nav-action search-nav-cart" id="cart-btn">
            <div className="cart-icon-wrapper">
              <img src={cartIcon} alt="Cart" className="search-nav-action-icon" />
              <span className="cart-badge">1</span>
            </div>
            <span className="search-nav-action-label">Cart</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SearchNav;
