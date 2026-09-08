import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { compareItems } = useCompare();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/mobiles?q=${encodeURIComponent(searchTerm.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="main-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Electro<span className="brand-accent">Mob</span></span>
        </Link>

        {/* Global Search Bar */}
        <form className="nav-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search phones (e.g., iPhone 16, Samsung S25, Snapdragon)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="nav-search-btn" aria-label="Search">
            🔍
          </button>
        </form>

        {/* Hamburger toggle for mobile */}
        <button
          className={`menu-toggle-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/mobiles"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuOpen(false)}
          >
            All Mobiles
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMenuOpen(false)}
          >
            Compare
            {compareItems.length > 0 && (
              <span className="badge compare-badge">{compareItems.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/add-mobile"
            className="nav-add-btn"
            onClick={() => setMenuOpen(false)}
          >
            <span>+</span> Add Mobile
          </NavLink>

          <NavLink
            to="/cart"
            className="nav-cart-btn"
            onClick={() => setMenuOpen(false)}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {totalItems > 0 && (
              <span className="badge cart-badge">{totalItems}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
