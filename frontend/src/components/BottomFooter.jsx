import "./BottomFooter.css";
import sellIcon from "../assets/home/bottomFooter/sell-image-0489fc.svg";
import advertiseIcon from "../assets/home/bottomFooter/advertise-image-e4b62a.svg";
import giftCardIcon from "../assets/home/bottomFooter/gift-cards.svg";
import helpIcon from "../assets/home/bottomFooter/help-centre.svg";
import fbIcon from "../assets/home/bottomFooter/fb.svg";
import xIcon from "../assets/home/bottomFooter/X.svg";
import ytIcon from "../assets/home/bottomFooter/YoutubeLogo-958b78.svg";
import igIcon from "../assets/home/bottomFooter/InstagramLogo-854a2c.svg";
import paymentImg from "../assets/home/bottomFooter/payment-method-69e7ec.svg";

function BottomFooter() {
  return (
    <footer className="footer-bottom" id="footer-bottom">
      <div className="container">
        <div className="footer-bottom-inner">
          <div className="footer-columns">
            <div className="footer-col">
              <h4 className="footer-col-title">ABOUT</h4>
              <a href="#" className="footer-col-link">
                Contact Us
              </a>
              <a href="#" className="footer-col-link">
                About Us
              </a>
              <a href="#" className="footer-col-link">
                Careers
              </a>
              <a href="#" className="footer-col-link">
                Flipkart Stories
              </a>
              <a href="#" className="footer-col-link">
                Press
              </a>
              <a href="#" className="footer-col-link">
                Corporate Information
              </a>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">GROUP COMPANIES</h4>
              <a href="#" className="footer-col-link">
                Myntra
              </a>
              <a href="#" className="footer-col-link">
                Cleartrip
              </a>
              <a href="#" className="footer-col-link">
                Shopsy
              </a>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">HELP</h4>
              <a href="#" className="footer-col-link">
                Payments
              </a>
              <a href="#" className="footer-col-link">
                Shipping
              </a>
              <a href="#" className="footer-col-link">
                Cancellation & Returns
              </a>
              <a href="#" className="footer-col-link">
                FAQ
              </a>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">CONSUMER POLICY</h4>
              <a href="#" className="footer-col-link">
                Cancellation & Returns
              </a>
              <a href="#" className="footer-col-link">
                Terms Of Use
              </a>
              <a href="#" className="footer-col-link">
                Security
              </a>
              <a href="#" className="footer-col-link">
                Privacy
              </a>
              <a href="#" className="footer-col-link">
                Sitemap
              </a>
              <a href="#" className="footer-col-link">
                Grievance Redressal
              </a>
              <a href="#" className="footer-col-link">
                EPR Compliance
              </a>
              <a href="#" className="footer-col-link">
                FSSAI Food Safety Connect App
              </a>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Mail Us:</h4>
              <p className="footer-col-text">
                Flipkart Internet Private Limited,
              </p>
              <p className="footer-col-text">Buildings Alyssa, Begonia &</p>
              <p className="footer-col-text">Clove Embassy Tech Village,</p>
              <p className="footer-col-text">
                Outer Ring Road, Devarabeesanahalli Village,
              </p>
              <p className="footer-col-text">Bengaluru, 560103,</p>
              <p className="footer-col-text">Karnataka, India</p>
              <h4 className="footer-col-title" style={{ marginTop: 14 }}>
                Social:
              </h4>
              <div className="footer-social-icons">
                <a
                  href="https://www.facebook.com/flipkart"
                  className="footer-social-btn"
                  aria-label="Facebook"
                >
                  <img src={fbIcon} alt="Facebook" width="24" height="24" />
                </a>
                <a
                  href="https://www.twitter.com/flipkart"
                  className="footer-social-btn"
                  aria-label="Twitter"
                >
                  <img src={xIcon} alt="X" width="24" height="24" />
                </a>
                <a
                  href="https://www.youtube.com/flipkart"
                  className="footer-social-btn"
                  aria-label="YouTube"
                >
                  <img src={ytIcon} alt="YouTube" width="24" height="24" />
                </a>
                <a
                  href="https://www.instagram.com/flipkart"
                  className="footer-social-btn"
                  aria-label="Instagram"
                >
                  <img src={igIcon} alt="Instagram" width="20" height="20" />
                </a>
              </div>
            </div>

            <div className="footer-col" style={{ borderRight: "none" }}>
              <h4 className="footer-col-title">Registered Office Address:</h4>
              <p className="footer-col-text">
                Flipkart Internet Private Limited,
              </p>
              <p className="footer-col-text">Buildings Alyssa, Begonia &</p>
              <p className="footer-col-text">Clove Embassy Tech Village,</p>
              <p className="footer-col-text">
                Outer Ring Road, Devarabeesanahalli Village,
              </p>
              <p className="footer-col-text">Bengaluru, 560103,</p>
              <p className="footer-col-text">Karnataka, India</p>
              <p className="footer-col-text">CIN : U51109KA2012PTC066107</p>
              <p className="footer-col-text">
                Telephone:{" "}
                <a href="tel:044-45614700" className="footer-col-link">
                  044-45614700
                </a>{" "}
                /{" "}
                <a href="tel:044-67415800" className="footer-col-link">
                  044-67415800
                </a>
              </p>
            </div>
          </div>

          <div className="footer-bar">
            <div className="footer-bar-item">
              <img src={sellIcon} alt="" width="13" height="12" />
              <a href="#">Become a Seller</a>
            </div>
            <div className="footer-bar-item">
              <img src={advertiseIcon} alt="" width="14" height="14" />
              <a href="#">Advertise</a>
            </div>
            <div className="footer-bar-item">
              <img src={giftCardIcon} alt="" width="13" height="13" />
              <a href="#">Gift Cards</a>
            </div>
            <div className="footer-bar-item">
              <img src={helpIcon} alt="" width="13" height="13" />
              <a href="#">Help Center</a>
            </div>
            <span className="footer-copyright">© 2007-2026 Flipkart.com</span>
            <img
              src={paymentImg}
              alt="Payment methods"
              className="footer-payment-img"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BottomFooter;
