import { Link } from "react-router-dom";
import bgImage from "../assets/home/topSelection/bg.png";
import hooks from "../assets/home/topSelection/50-50-50-pack-wall-hook-wait2shop-original-imahfzffdzdmfczy.jpeg";
import drawerDividers from "../assets/home/topSelection/bs1-houseofcommon-original-imahfphwcrzqngyr.jpeg";
import surgicalGloves from "../assets/home/topSelection/100-medical-556-e-solutions-original-imah5vm4cckncw8y.png";
import kitchenTrolley from "../assets/home/topSelection/290-1-pp-fa06-grotheory-grey-450-original-imahmfz7nqpgyhzu.jpeg";
import "./TopSelection.css";

const items = [
  { img: hooks, name: "WAIT2SHOP Hooks", subtitle: "Most-loved", productId: 7 },
  {
    img: drawerDividers,
    name: "Madrid Closet Drawer Dividers",
    subtitle: "New Collection",
    productId: 3,
  },
  {
    img: surgicalGloves,
    name: "Surgical Gloves",
    subtitle: "Top Collection",
    productId: 6,
  },
  {
    img: kitchenTrolley,
    name: "Kitchen Trolleys",
    subtitle: "Special offer",
    productId: 12,
  },
];

function TopSelection() {
  return (
    <section className="top-selection" id="top-selection">
      <div
        className="container top-selection-inner"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="top-selection-header">
          <h2 className="top-selection-title">Top Selection</h2>
          <a href="#" className="top-selection-arrow" aria-label="View all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div className="top-selection-grid">
          {items.map((item, i) => (
            <Link
              to={`/products/${item.productId}`}
              className="top-selection-card"
              key={i}
              id={`top-selection-${i}`}
            >
              <div className="top-selection-img-wrapper">
                <img
                  src={item.img}
                  alt={item.name}
                  className="top-selection-img"
                />
              </div>
              <div className="top-selection-info">
                <span className="top-selection-name">{item.name}</span>
                <span className="top-selection-subtitle">{item.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopSelection;
