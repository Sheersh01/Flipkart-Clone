import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import bodyWash from "../assets/home/stillLookingForThese/400-just-relax-and-recharge-body-wash-2-denver-original-imah2dhyajr5bc9s.jpeg";
import mouse from "../assets/home/stillLookingForThese/spectre-3600-dpi-gaming-sensor-and-7-colours-rainbow-lighting-original-imahm7h6xshabemn.jpeg";
import womensKurtas from "../assets/home/stillLookingForThese/xl-single-gsm120-styloketh-original-imahdby5kjhnd35r.jpeg";
import chocolates from "../assets/home/stillLookingForThese/-original-imahhmbdzj7wxahg.jpeg";
import surgicalGloves from "../assets/home/stillLookingForThese/20-premium-quality-gloves-dm-india-original-imagevz4bzgtvrpx.jpeg";
import mensShirt from "../assets/home/stillLookingForThese/m-kawler-light-2410-sk-creation-original-imahh6ctamwj4hpd.jpeg";
import oxygenMeter from "../assets/home/stillLookingForThese/healthcare-oxygen-flow-meter-adjustment-valve-regulator-with-original-imahcrgmah4pgmzh.jpeg";
import "./StillLooking.css";

const items = [
  { img: bodyWash, label: "Body Wash", productId: 4 },
  { img: mouse, label: "Mouse", productId: 1 },
  { img: womensKurtas, label: "Women's Kurtas", productId: 8 },
  { img: chocolates, label: "Chocolates", productId: 3 },
  { img: surgicalGloves, label: "Surgical Gloves", productId: 6 },
  { img: mensShirt, label: "Men's Shirt", productId: 8 },
  { img: oxygenMeter, label: "Oxygen Meter", productId: 5 },
];

function StillLooking() {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="still-looking" id="still-looking">
      <div className="container still-looking-inner">
        <h2 className="still-looking-title">Vinod, still looking for these?</h2>
        <div className="still-looking-carousel">
          <div
            className="still-looking-track"
            ref={scrollRef}
            onScroll={checkScroll}
          >
            {items.map((item, i) => (
              <Link
                to={`/products/${item.productId}`}
                className="still-looking-card"
                key={i}
                id={`still-looking-${i}`}
              >
                <div className="still-looking-img-wrapper">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="still-looking-img"
                  />
                </div>
                <span className="still-looking-label">{item.label}</span>
              </Link>
            ))}
          </div>
          {canScrollLeft && (
            <button
              className="still-looking-btn still-looking-btn--left"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              className="still-looking-btn still-looking-btn--right"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default StillLooking;
