import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductNavHeader from "../components/ProductNavHeader";
import ProductGrid from "../components/ProductGrid";
import BottomFooter from "../components/BottomFooter";
import {
  productAssets,
  productContent,
  useProductPageState,
} from "../features/product";
import "./product.css";

function ProductPage() {
  const { id } = useParams();

  const {
    likeIcon,
    shareIcon,
    mainImage,
    galleryImages,
    colorOne,
    colorTwo,
    wowDealIcon,
    sevenDaysReturnIcon,
    cashOnDeliveryIcon,
    flipkartAssuredIcon,
    deliveryIcon,
    homeDeliveryIcon,
    shopIcon,
  } = productAssets;

  const { emiCards, protectionPlanItems, detailsTabs, generalDetails } =
    useMemo(() => productContent, []);

  const {
    selectedId,
    isEmiOpen,
    setIsEmiOpen,
    activeEmiIndex,
    goToNextEmiCard,
    goToPrevEmiCard,
    showPrevEmiArrow,
    showNextEmiArrow,
    isProtectionOpen,
    setIsProtectionOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isQaOpen,
    setIsQaOpen,
    isReviewsOpen,
    setIsReviewsOpen,
    activeDetailsTab,
    setActiveDetailsTab,
  } = useProductPageState(id, emiCards.length);

  return (
    <div className="product-page" id="product-page-root">
      <ProductNavHeader />

      <main className="product-main" id="product-main-content">
        <div className="container product-main-inner">
          <p className="product-breadcrumbs product-breadcrumbs--top">
            Home / Computers / Computer Peripherals / Keyboards, Mouse &
            Accessories / Mouse / Portronics Mouse
          </p>

          <div className="product-content-grid">
            <section className="product-left-column">
              <div className="product-left-sticky">
                <button
                  className="media-floating-icon media-floating-icon--like"
                  aria-label="Add to wishlist"
                >
                  <img src={likeIcon} alt="Like" />
                </button>
                <button
                  className="media-floating-icon media-floating-icon--share"
                  aria-label="Share product"
                >
                  <img src={shareIcon} alt="Share" />
                </button>

                <div className="product-image-grid">
                  <div className="product-image-card product-image-card--main">
                    <img
                      src={mainImage}
                      alt="Portronics Vader 2.0 mouse"
                      className="product-media-image"
                    />
                  </div>

                  {galleryImages.slice(1).map((image, index) => (
                    <div className="product-image-card" key={index}>
                      <img
                        src={image}
                        alt={`Product gallery ${index + 1}`}
                        className="product-media-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="product-right-column">
              <div className="product-right-scroll">
                <div className="product-brand-row">
                  <img
                    src={colorTwo}
                    alt="Brand visual"
                    className="brand-thumb"
                  />
                  <div className="brand-title-wrap">
                    <p className="brand-title">
                      AMKETTE XS Series Flow Ergonomic Optical Mouse Multi...
                    </p>
                    <p className="brand-price-line">
                      4.3 ★ | ₹599 <span className="ad-chip">AD</span>
                    </p>
                  </div>
                </div>

                <p className="selected-color-text">
                  Selected Color: <span>Black</span>
                </p>
                <div className="color-select-row">
                  <button
                    className="color-card color-card--active"
                    aria-label="Select black color"
                  >
                    <img src={colorOne} alt="Black color" />
                  </button>
                  <button
                    className="color-card"
                    aria-label="Select white color"
                  >
                    <img src={colorTwo} alt="White color" />
                  </button>
                </div>

                <h1 className="product-title-main">
                  Portronics Vader 2.0 Wired Ergonomic Optical Gaming Mouse 7
                  Prog.
                  <span className="id-pill">ID: {selectedId}</span>
                </h1>

                <div className="product-rating-row">
                  <span className="rating-pill">4.4 ★</span>
                  <span className="rating-count">339</span>
                </div>

                <div className="deal-row">
                  <span className="deal-chip">Hot Deal</span>
                  <span className="discount-text">67% </span>
                  <span className="price-old">1,499</span>
                  <span className="price-new">₹499</span>
                </div>

                <div className="wow-deal-strip">
                  <img src={wowDealIcon} alt="Wow deal" />
                  <span>Buy at ₹434</span>
                </div>

                <div className="accordion-list">
                  <button
                    className="accordion-item accordion-item--primary"
                    type="button"
                  >
                    <span>Apply offers for maximum savings!</span>
                    <span>▾</span>
                  </button>

                  <div
                    className={`emi-accordion-shell${isEmiOpen ? " emi-accordion-shell--open" : ""}`}
                  >
                    <button
                      className="accordion-item accordion-item--secondary"
                      type="button"
                      onClick={() => setIsEmiOpen((prev) => !prev)}
                      aria-expanded={isEmiOpen}
                    >
                      <span>Apply for Card and Instant EMI</span>
                      <span>{isEmiOpen ? "▴" : "▾"}</span>
                    </button>

                    <div
                      className="emi-dropdown-panel"
                      aria-label="Card and EMI offers carousel"
                    >
                      {showPrevEmiArrow && (
                        <button
                          type="button"
                          className="emi-carousel-arrow emi-carousel-arrow--left"
                          onClick={goToPrevEmiCard}
                          aria-label="Previous EMI offer"
                        >
                          ‹
                        </button>
                      )}

                      {showNextEmiArrow && (
                        <button
                          type="button"
                          className="emi-carousel-arrow emi-carousel-arrow--right"
                          onClick={goToNextEmiCard}
                          aria-label="Next EMI offer"
                        >
                          ›
                        </button>
                      )}

                      <div className="emi-carousel-viewport">
                        <div
                          className="emi-carousel-track"
                          style={{
                            transform: `translateX(-${activeEmiIndex * 100}%)`,
                          }}
                        >
                          {emiCards.map((card, index) => (
                            <div className="emi-carousel-slide" key={index}>
                              <div className="emi-offer-card">
                                <img src={card.icon} alt="Offer" />
                                <div className="emi-offer-content">
                                  <p className="emi-offer-title">
                                    {card.title}
                                  </p>
                                  <p className="emi-offer-subtitle">
                                    {card.subtitle}
                                  </p>
                                  <a href="#" className="emi-offer-cta">
                                    {card.cta}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="section-block section-block--delivery">
                  <h2>Delivery details</h2>
                  <div className="delivery-card">
                    <div className="delivery-row delivery-row--home">
                      <img src={homeDeliveryIcon} alt="Home" />
                      <p>
                        <strong>HOME</strong> IIT NAGPUR, Near IIITN Main Gate,
                        Nagpur, ...
                      </p>
                      <span className="delivery-row-arrow">›</span>
                    </div>

                    <div className="delivery-row delivery-row--express">
                      <img src={deliveryIcon} alt="Express delivery" />
                      <p>
                        <strong>EXPRESS</strong> Delivery by Tomorrow
                      </p>
                    </div>

                    <div className="delivery-row delivery-row--fulfilled">
                      <img src={shopIcon} alt="Fulfilled by seller" />
                      <div className="fulfilled-block">
                        <p>Fulfilled by RetailNet</p>
                        <p>4.3 ★ • 10 years with Flipkart</p>
                        <a href="#">See other sellers</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="feature-icons-row">
                  <div className="feature-icon-card">
                    <img src={sevenDaysReturnIcon} alt="7 day return" />
                    <span>7-Day Return</span>
                  </div>
                  <div className="feature-icon-card">
                    <img src={cashOnDeliveryIcon} alt="Cash on delivery" />
                    <span>Cash on Delivery</span>
                  </div>
                  <div className="feature-icon-card">
                    <img src={flipkartAssuredIcon} alt="Flipkart assured" />
                    <span>Flipkart Assured</span>
                  </div>
                </div>

                <div className="section-block protection-accordion-shell">
                  <button
                    className="accordion-item protection-accordion-header"
                    type="button"
                    onClick={() => setIsProtectionOpen((prev) => !prev)}
                    aria-expanded={isProtectionOpen}
                  >
                    <div className="protection-accordion-heading">
                      <span className="protection-accordion-title">
                        Protection plans
                      </span>
                      {!isProtectionOpen && (
                        <span className="protection-accordion-subtitle">
                          Protect your device from accidental damages
                        </span>
                      )}
                    </div>
                    <span className="accordion-chevron">
                      {isProtectionOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  <div
                    className={`protection-accordion-panel${isProtectionOpen ? " protection-accordion-panel--open" : ""}`}
                  >
                    {protectionPlanItems.map((plan, index) => (
                      <div className="protection-plan-card" key={index}>
                        <div className="protection-plan-toprow">
                          <div className="protection-plan-brand">
                            <img src={plan.icon} alt="Protection provider" />
                            <div>
                              <p className="protection-plan-title">
                                {plan.title}
                              </p>
                            </div>
                          </div>
                          <div className="protection-plan-price">
                            <p>{plan.price}</p>
                            <span>{plan.subPrice}</span>
                          </div>
                        </div>

                        <div className="protection-plan-divider" />

                        <div className="protection-plan-details">
                          {plan.details.map((detail) => (
                            <div
                              className="protection-detail-row"
                              key={detail.label}
                            >
                              <img
                                className="protection-detail-icon"
                                src={detail.icon}
                                alt={detail.label}
                              />
                              <span>{detail.label}</span>
                            </div>
                          ))}
                          <a href="#" className="protection-more-link">
                            See more details
                          </a>
                        </div>

                        <div className="protection-plan-actions">
                          <select
                            className="protection-duration-select"
                            defaultValue="1 year"
                          >
                            <option value="1 year">1 year (₹183)</option>
                            <option value="2 years">2 years (₹329)</option>
                          </select>
                          <button type="button" className="protection-add-btn">
                            Add plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="section-block details-accordion-shell">
                  <button
                    className="accordion-item details-accordion-header"
                    type="button"
                    onClick={() => setIsDetailsOpen((prev) => !prev)}
                    aria-expanded={isDetailsOpen}
                  >
                    <div className="details-accordion-heading">
                      <span className="details-accordion-title">
                        All details
                      </span>
                      {!isDetailsOpen && (
                        <span className="details-accordion-subtitle">
                          Features, description and more
                        </span>
                      )}
                    </div>
                    <span className="accordion-chevron">
                      {isDetailsOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  <div
                    className={`details-accordion-panel${isDetailsOpen ? " details-accordion-panel--open" : ""}`}
                  >
                    <div
                      className="details-tabs-row"
                      role="tablist"
                      aria-label="Product details tabs"
                    >
                      {detailsTabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`details-tab${activeDetailsTab === tab.id ? " details-tab--active" : ""}`}
                          onClick={() => setActiveDetailsTab(tab.id)}
                          role="tab"
                          aria-selected={activeDetailsTab === tab.id}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {activeDetailsTab === "specifications" && (
                      <div className="details-specs">
                        <h3>General</h3>
                        <div className="details-spec-grid">
                          {generalDetails.map(([label, value]) => (
                            <div className="details-spec-item" key={label}>
                              <span className="details-spec-label">
                                {label}
                              </span>
                              <span className="details-spec-value">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <h3>Additional Features</h3>
                        <div className="details-spec-single">
                          <span className="details-spec-label">
                            Other Features
                          </span>
                          <span className="details-spec-value">
                            Adjustable DPI Upto 7200, Polling Rate 500, RGB
                            Light Effect, Programmable Keys
                          </span>
                        </div>

                        <div
                          className={`details-extra-section${isDetailsExpanded ? " details-extra-section--open" : ""}`}
                        >
                          <h3>Connectivity and Power Features</h3>
                          <div className="details-spec-single">
                            <span className="details-spec-label">
                              Bluetooth
                            </span>
                            <span className="details-spec-value">No</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDetailsTab === "description" && (
                      <div className="details-description">
                        <p>
                          Portronics Vader 2.0 is a wired ergonomic gaming mouse
                          with adjustable DPI, programmable keys, and RGB
                          lighting for everyday and gaming use.
                        </p>
                      </div>
                    )}

                    {activeDetailsTab === "manufacturer" && (
                      <div className="details-manufacturer">
                        <div className="details-spec-single">
                          <span className="details-spec-label">
                            Manufacturer
                          </span>
                          <span className="details-spec-value">
                            Portronics Digital Pvt. Ltd.
                          </span>
                        </div>
                        <div className="details-spec-single">
                          <span className="details-spec-label">
                            Country of Origin
                          </span>
                          <span className="details-spec-value">India</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="details-more-toggle"
                      onClick={() => setIsDetailsExpanded((prev) => !prev)}
                    >
                      {isDetailsExpanded ? "See less" : "See more"}
                      <span>{isDetailsExpanded ? "▴" : "▾"}</span>
                    </button>
                  </div>
                </div>
                <div className="section-block reviews-accordion-shell">
                  <button
                    className="accordion-item reviews-accordion-header"
                    type="button"
                    onClick={() => setIsReviewsOpen((prev) => !prev)}
                    aria-expanded={isReviewsOpen}
                  >
                    <div className="reviews-accordion-heading">
                      <span className="reviews-accordion-title">
                        Ratings and reviews
                      </span>
                      {!isReviewsOpen && (
                        <span className="reviews-accordion-subtitle">
                          No reviews yet
                        </span>
                      )}
                    </div>
                    <span className="accordion-chevron">
                      {isReviewsOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  <div
                    className={`reviews-accordion-panel${isReviewsOpen ? " reviews-accordion-panel--open" : ""}`}
                  >
                    <p className="reviews-empty-state">No reviews yet</p>
                  </div>
                </div>
                <div className="section-block qa-accordion-shell">
                  <button
                    className="accordion-item qa-accordion-header"
                    type="button"
                    onClick={() => setIsQaOpen((prev) => !prev)}
                    aria-expanded={isQaOpen}
                  >
                    <div className="qa-accordion-heading">
                      <span className="qa-accordion-title">
                        Questions and Answers
                      </span>
                      {!isQaOpen && (
                        <span className="qa-accordion-subtitle">
                          No questions and answers available
                        </span>
                      )}
                    </div>
                    <span className="accordion-chevron">
                      {isQaOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  <div
                    className={`qa-accordion-panel${isQaOpen ? " qa-accordion-panel--open" : ""}`}
                  >
                    <p className="qa-empty-state">
                      Be the first to ask about this product
                    </p>
                    <input
                      type="text"
                      className="qa-input"
                      placeholder="Ask a question"
                      aria-label="Ask a question"
                    />
                  </div>
                </div>
              </div>

              <div className="right-footer-actions">
                <button className="btn-cart" type="button">
                  Add to cart
                </button>
                <button className="btn-buy" type="button">
                  Buy at ₹499
                </button>
              </div>
            </section>
          </div>

          <section
            className="similar-products-section"
            aria-label="Similar products"
          >
            <h2 className="similar-products-title">Similar products</h2>
            <ProductGrid />
          </section>
        </div>
      </main>
      <BottomFooter />
    </div>
  );
}

export default ProductPage;
