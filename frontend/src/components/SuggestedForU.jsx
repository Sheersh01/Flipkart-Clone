import { useState, useRef, useEffect } from 'react';
import img1 from '../assets/home/suggestedForU/value-model-2-0-kombuis-kitchenware-original-imaheufmgj6wkk2a.jpeg';
import img2 from '../assets/home/suggestedForU/39-5-layers-pink-plastic-cabinet-for-compact-homes-maxtid-45-original-imahmhggsh94j4hh.jpeg';
import img3 from '../assets/home/suggestedForU/vgx-ssdr2t-vigneshgenix-original-imahj3ffckzvtwqf.jpeg';
import img4 from '../assets/home/suggestedForU/kombuis-container-spice-holder-kombuis-kitchenware-original-imahjcgqqyfffnus.jpeg';
import img5 from '../assets/home/suggestedForU/square-pipe-fruit-and-vegetable-trolly-4-layer-kitchen-bazzar-original-imag2fhzrztzekny.jpeg';
import img6 from '../assets/home/suggestedForU/containers-kitchen-rack-steel-multipurpose-heavy-stainless-steel-original-imahhyn5hghbpypy.jpeg';
import img7 from '../assets/home/suggestedForU/axune-tier-spice-rack-organiser-jun-axune-original-imag3tw8gtgnpkhk.jpeg';
import ad1 from '../assets/home/suggestedForU/b060a11aea506a1a.png';
import ad2 from '../assets/home/suggestedForU/01ecc6763673fc00.png';
import ad3 from '../assets/home/suggestedForU/aeecb7b1b3bf227c.png';
import './SuggestedForU.css';

const products = [
  { img: img1, name: 'MAXTID 6 Layer White Orga...', rating: '4.5', originalPrice: '₹3,999', salePrice: '₹1,541', buyAt: '₹1,491' },
  { img: img2, name: 'MAXTID 5 Layer White Cabin...', rating: '4.1', originalPrice: '₹1,199', salePrice: '₹300', buyAt: '₹250' },
  { img: img3, name: 'MAXTID 5 Layer Whtet Cabi...', rating: '4', originalPrice: '₹1,599', salePrice: '₹799', buyAt: '₹749' },
  { img: img4, name: 'eshopy Organizer-5666 Clos...', rating: '', originalPrice: '₹1,099', salePrice: '₹473', buyAt: '₹423' },
  { img: img5, name: 'ELIGHTWAY MART 6 Compa...', rating: '', originalPrice: '₹1,899', salePrice: '₹998', buyAt: '₹948' },
  { img: img6, name: 'PILOT MA...', rating: '4.1', originalPrice: '₹999', salePrice: '₹205', buyAt: '₹155' },
  { img: img7, name: 'Axune Tier Spice Rack...', rating: '4.2', originalPrice: '₹1,299', salePrice: '₹599', buyAt: '₹549' },
];

const ads = [
  { img: ad1, alt: 'Noise earbuds ad' },
  { img: ad2, alt: 'MIVI earbuds ad' },
  { img: ad3, alt: 'TRIGGR earbuds ad' },
];

function SuggestedForU() {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => { checkScroll(); }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? 320 : -320,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="suggested" id="suggested-for-you">
      <div className="container suggested-inner">
        <div className="suggested-header">
          <h2 className="suggested-title">Suggested For You</h2>
          <a href="#" className="suggested-arrow" aria-label="View all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Product cards row */}
        <div className="suggested-products-wrap">
          <div className="suggested-products" ref={scrollRef} onScroll={checkScroll}>
            {products.map((p, i) => (
              <a href="#" className="suggested-card" key={i} id={`suggested-product-${i}`}>
                <div className="suggested-card-img-wrap">
                  <img src={p.img} alt={p.name} className="suggested-card-img" />
                  {p.rating && (
                    <span className="suggested-card-rating">
                      {p.rating} ★
                    </span>
                  )}
                </div>
                <div className="suggested-card-info">
                  <span className="suggested-card-name">{p.name}</span>
                  <div className="suggested-card-prices">
                    <span className="suggested-card-original">{p.originalPrice}</span>
                    <span className="suggested-card-sale">{p.salePrice}</span>
                  </div>
                  <span className="suggested-card-buyat">Buy at {p.buyAt}</span>
                </div>
              </a>
            ))}
          </div>
          {canScrollLeft && (
            <button className="suggested-scroll-btn suggested-scroll-btn--left" onClick={() => scroll('left')} aria-label="Scroll left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button className="suggested-scroll-btn suggested-scroll-btn--right" onClick={() => scroll('right')} aria-label="Scroll right">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Ad banners row */}
        <div className="suggested-ads">
          {ads.map((ad, i) => (
            <a href="#" className="suggested-ad" key={i} id={`suggested-ad-${i}`}>
              <img src={ad.img} alt={ad.alt} className="suggested-ad-img" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuggestedForU;
