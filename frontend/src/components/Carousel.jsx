import { useState, useEffect, useCallback, useRef } from 'react';
import img1 from '../assets/home/carausel/1.jpg';
import img2 from '../assets/home/carausel/2.png';
import img3 from '../assets/home/carausel/3.png';
import img4 from '../assets/home/carausel/4.png';
import img5 from '../assets/home/carausel/5.png';
import img6 from '../assets/home/carausel/6.png';
import img7 from '../assets/home/carausel/7.png';
import img8 from '../assets/home/carausel/8.png';
import img9 from '../assets/home/carausel/9.png';
import './Carousel.css';

const slides = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const GAP = 10; // px gap between cards

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  // Calculate card width dynamically: we want 2.5 cards visible
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        // 2.5 cards + 2 gaps (between card1-2, card2-3)
        const w = (wrapperWidth - GAP * 2) / 2.5;
        setCardWidth(w);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const maxIndex = slides.length - 3; // don't scroll past last visible set

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const translateX = current * (cardWidth + GAP);

  return (
    <div
      className="carousel"
      id="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container carousel-container">
        <div className="carousel-track-wrapper" ref={wrapperRef}>
          <div
            className="carousel-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${translateX}px)`,
              gap: `${GAP}px`,
            }}
          >
            {slides.map((slide, i) => (
              <div
                className="carousel-slide"
                key={i}
                style={{ width: cardWidth ? `${cardWidth}px` : '38%', minWidth: cardWidth ? `${cardWidth}px` : '38%' }}
              >
                <img src={slide} alt={`Banner ${i + 1}`} className="carousel-img" />
              </div>
            ))}
          </div>

          <button
            className="carousel-btn carousel-btn--prev"
            onClick={prevSlide}
            aria-label="Previous slide"
            id="carousel-prev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="carousel-btn carousel-btn--next"
            onClick={nextSlide}
            aria-label="Next slide"
            id="carousel-next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' carousel-dot--active' : ''}`}
            onClick={() => setCurrent(Math.min(i, maxIndex))}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
