import flipkartLogo from "../assets/home/topNav/flipkart.png";
import flipkartIcon from "../assets/home/topNav/flipkartIcon.png";
import minutesLogo from "../assets/home/topNav/minutes.png";
import minutesIcon from "../assets/home/topNav/minutesIcon.png";
import travelLogo from "../assets/home/topNav/travel.png";
import travelIcon from "../assets/home/topNav/travelIcon.png";
import "./TopNav.css";

function TopNav() {
  return (
    <nav className="top-nav" id="top-nav">
      <div className="container top-nav-inner">
        <div className="top-nav-left">
          <a
            href="#"
            className="top-nav-btn top-nav-btn--flipkart"
            id="flipkart-btn"
          >
            <img
              src={flipkartIcon}
              alt="Flipkart"
              className="top-nav-btn-icon"
            />
            <img
              src={flipkartLogo}
              alt="Flipkart"
              className="top-nav-btn-text"
            />
          </a>
          <a
            href="#"
            className="top-nav-btn top-nav-btn--minutes"
            id="minutes-btn"
          >
            <img src={minutesIcon} alt="Minutes" className="top-nav-btn-icon" />
            <img src={minutesLogo} alt="Minutes" className="top-nav-btn-text" />
          </a>
          <a
            href="#"
            className="top-nav-btn top-nav-btn--travel"
            id="travel-btn"
          >
            <img src={travelIcon} alt="Travel" className="top-nav-btn-icon" />
            <img src={travelLogo} alt="Travel" className="top-nav-btn-text" />
          </a>
        </div>
        <div className="top-nav-right">
          <div className="top-nav-address" id="delivery-address">
            <span className="top-nav-address-icon">🏠</span>
            <span className="top-nav-address-label">HOME</span>
            <span className="top-nav-address-text">
              IIIT NAGPUR, Near IITN Main Gat...
            </span>
            <span className="top-nav-address-arrow">›</span>
          </div>
          <div className="top-nav-supercoin" id="supercoin-btn">
            <span className="supercoin-icon">🪙</span>
            <span className="supercoin-count">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
