import { Link } from "react-router-dom";
import flipkartLogo from "../assets/home/topNav/flipkart.png";
import flipkartIcon from "../assets/home/topNav/flipkartIcon.png";
import profileIcon from "../assets/home/searchNavSide/profile-6bae67.svg";
import cartIcon from "../assets/home/searchNavSide/header_cart_v4-6ac9a8.svg";
import "./ProductNavHeader.css";

function ProductNavHeader() {
  return (
    <header className="product-header" id="product-header">
      <div className="container product-header-inner">
        <Link
          to="/"
          className="product-logo-pill"
          id="product-logo-pill"
          aria-label="Go to home"
        >
          <img
            src={flipkartIcon}
            alt="Flipkart"
            className="product-logo-pill-icon"
          />
          <img
            src={flipkartLogo}
            alt="Flipkart"
            className="product-logo-pill-text"
          />
          <svg
            className="product-logo-pill-caret"
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

        <div className="product-search" id="product-search">
          <svg
            className="product-search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="product-search-input"
            placeholder="Search for Products, Brands and More"
            aria-label="Search products"
          />
        </div>

        <nav className="product-actions" aria-label="User actions">
          <a href="#" className="product-action" id="product-profile-action">
            <img
              src={profileIcon}
              alt="Profile"
              className="product-action-icon"
            />
            <span className="product-action-label">vinod</span>
            <svg
              className="product-action-caret"
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
          </a>

          <a href="#" className="product-action" id="product-more-action">
            <span className="product-action-label">More</span>
            <svg
              className="product-action-caret"
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
          </a>

          <Link
            to="/cart"
            className="product-action product-action-cart"
            id="product-cart-action"
          >
            <span className="product-cart-icon-wrap">
              <img src={cartIcon} alt="Cart" className="product-action-icon" />
              <span className="product-cart-badge">1</span>
            </span>
            <span className="product-action-label">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default ProductNavHeader;
