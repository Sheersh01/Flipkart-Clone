import { useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../assets/home/searchNavSide/profile-6bae67.svg";
import cartIcon from "../assets/home/searchNavSide/header_cart_v4-6ac9a8.svg";
import { useAppContext } from "../context/AppContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function SearchNavActions() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { authUser, cartCount, login, register, logout } = useAppContext();

  const openLogin = () => {
    setAuthMode("login");
    setAuthError("");
    setShowLoginModal(true);
    setShowProfileMenu(false);
    setShowMoreMenu(false);
  };

  const closeLogin = () => {
    setShowLoginModal(false);
    setAuthError("");
    setFieldErrors({});
    setAuthMode("login");
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!emailRegex.test(loginForm.email.trim())) {
      nextErrors.loginEmail = "Please enter a valid email address.";
    }

    if (!loginForm.password) {
      nextErrors.loginPassword = "Password is required.";
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError("");
      setFieldErrors({});
      const payload = {
        email: loginForm.email.trim(),
        password: loginForm.password,
      };
      await login(payload);
      closeLogin();
    } catch (error) {
      setAuthError(error.message || "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!registerForm.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!phoneRegex.test(registerForm.phone.trim())) {
      nextErrors.phone = "Phone must be a valid 10-digit Indian mobile number.";
    }

    if (!emailRegex.test(registerForm.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!passwordStrengthRegex.test(registerForm.password)) {
      nextErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number, and special character.";
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      nextErrors.confirmPassword =
        "Password and confirm password do not match.";
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError("");
      setFieldErrors({});

      const payload = {
        fullName: registerForm.fullName.trim(),
        phone: registerForm.phone.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      };

      await register(payload);
      closeLogin();
    } catch (error) {
      setAuthError(error.message || "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore logout failures and clear local state regardless.
    } finally {
      setShowProfileMenu(false);
      setShowMoreMenu(false);
    }
  };

  return (
    <>
      <div
        className="search-nav-action-wrapper"
        onMouseEnter={() => setShowProfileMenu(true)}
        onMouseLeave={() => setShowProfileMenu(false)}
      >
        <a href="#" className="search-nav-action" id="profile-btn">
          <img
            src={profileIcon}
            alt="Profile"
            className="search-nav-action-icon"
          />
          <span className="search-nav-action-label">
            {authUser?.fullName || authUser?.name || "Login"}
          </span>
          <svg
            className={`dropdown-arrow ${showProfileMenu ? "rotated" : ""}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {showProfileMenu && (
          <div className="search-nav-dropdown profile-dropdown">
            {authUser ? (
              <>
                <div className="dropdown-header">Your Account</div>
                <a href="#" className="dropdown-item">
                  My Profile
                </a>
                <Link
                  to="/orders"
                  className="dropdown-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Orders
                </Link>
                <a href="#" className="dropdown-item">
                  Coupons
                </a>
                <a href="#" className="dropdown-item">
                  Supercoin
                </a>
                <a href="#" className="dropdown-item">
                  Flipkart Plus Zone
                </a>
                <a href="#" className="dropdown-item">
                  Saved Cards & Wallet
                </a>
                <a href="#" className="dropdown-item">
                  Saved Addresses
                </a>
                <a href="#" className="dropdown-item">
                  Wishlist
                </a>
                <a href="#" className="dropdown-item">
                  Gift Cards
                </a>
                <a href="#" className="dropdown-item">
                  Notifications
                </a>
                <button
                  type="button"
                  className="dropdown-item logout-item dropdown-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="dropdown-header">Welcome</div>
                <div className="dropdown-copy">
                  Log in to view orders, wishlist and saved details.
                </div>
                <button
                  type="button"
                  className="dropdown-item login-cta dropdown-button"
                  onClick={openLogin}
                >
                  Login / Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div
        className="search-nav-action-wrapper"
        onMouseEnter={() => setShowMoreMenu(true)}
        onMouseLeave={() => setShowMoreMenu(false)}
      >
        <a href="#" className="search-nav-action" id="more-btn">
          <span className="search-nav-action-label">More</span>
          <svg
            className={`dropdown-arrow ${showMoreMenu ? "rotated" : ""}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {showMoreMenu && (
          <div className="search-nav-dropdown more-dropdown">
            <a href="#" className="dropdown-item">
              Become a Seller
            </a>
            <a href="#" className="dropdown-item">
              Notification Settings
            </a>
            <a href="#" className="dropdown-item">
              24x7 Customer Care
            </a>
            <a href="#" className="dropdown-item">
              Advertise on Flipkart
            </a>
          </div>
        )}
      </div>

      {showLoginModal ? (
        <div className="auth-modal-backdrop" onClick={closeLogin}>
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Login form"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="auth-modal-header">
              <div>
                <p className="auth-eyebrow">Account access</p>
                <h3>
                  {authMode === "login"
                    ? "Login to Flipkart"
                    : "Create Flipkart Account"}
                </h3>
              </div>
              <button
                type="button"
                className="auth-close-btn"
                onClick={closeLogin}
                aria-label="Close login dialog"
              >
                ×
              </button>
            </div>

            <div className="auth-switch-row" style={{ marginBottom: 12 }}>
              <button
                type="button"
                className="dropdown-item dropdown-button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setFieldErrors({});
                }}
                disabled={isSubmitting}
              >
                Login
              </button>
              <button
                type="button"
                className="dropdown-item dropdown-button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                  setFieldErrors({});
                }}
                disabled={isSubmitting}
              >
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <label>
                  Email
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Enter email"
                    autoFocus
                    required
                  />
                  {fieldErrors.loginEmail ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.loginEmail}
                    </small>
                  ) : null}
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter password"
                    required
                  />
                  {fieldErrors.loginPassword ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.loginPassword}
                    </small>
                  ) : null}
                </label>
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Login"}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={registerForm.fullName}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Enter full name"
                    autoFocus
                    required
                  />
                  {fieldErrors.fullName ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.fullName}
                    </small>
                  ) : null}
                </label>
                <label>
                  Phone
                  <input
                    type="text"
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="Enter phone"
                    required
                  />
                  {fieldErrors.phone ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.phone}
                    </small>
                  ) : null}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Enter email"
                    required
                  />
                  {fieldErrors.email ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.email}
                    </small>
                  ) : null}
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Enter password"
                    required
                  />
                  {fieldErrors.password ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.password}
                    </small>
                  ) : null}
                </label>
                <label>
                  Confirm Password
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Confirm password"
                    required
                  />
                  {fieldErrors.confirmPassword ? (
                    <small style={{ color: "#b91c1c" }}>
                      {fieldErrors.confirmPassword}
                    </small>
                  ) : null}
                </label>
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Register"}
                </button>
              </form>
            )}

            {authError ? (
              <p style={{ color: "#b91c1c", marginTop: 10, fontSize: 13 }}>
                {authError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {authUser ? (
        <Link
          to="/cart"
          className="search-nav-action search-nav-cart"
          id="cart-btn"
        >
          <div className="cart-icon-wrapper">
            <img src={cartIcon} alt="Cart" className="search-nav-action-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span className="search-nav-action-label">Cart</span>
        </Link>
      ) : (
        <button
          type="button"
          className="search-nav-action search-nav-cart"
          id="cart-btn"
          onClick={openLogin}
        >
          <div className="cart-icon-wrapper">
            <img src={cartIcon} alt="Cart" className="search-nav-action-icon" />
          </div>
          <span className="search-nav-action-label">Cart</span>
        </button>
      )}
    </>
  );
}

export default SearchNavActions;
