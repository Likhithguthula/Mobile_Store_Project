import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-perks">
          <div className="perk-card">
            <span className="perk-icon">🚀</span>
            <div>
              <h4>Free Express Delivery</h4>
              <p>On all orders above ₹10,000</p>
            </div>
          </div>
          <div className="perk-card">
            <span className="perk-icon">🛡️</span>
            <div>
              <h4>100% Genuine Warranty</h4>
              <p>Official 1-year brand warranty</p>
            </div>
          </div>
          <div className="perk-card">
            <span className="perk-icon">🔄</span>
            <div>
              <h4>7 Days Replacement</h4>
              <p>Hassle-free replacement policy</p>
            </div>
          </div>
          <div className="perk-card">
            <span className="perk-icon">💳</span>
            <div>
              <h4>Secure Checkout</h4>
              <p>UPI, Cards & Net Banking ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">Electro<span className="brand-accent">Mob</span></span>
          </div>
          <p className="footer-desc">
            Your destination for flagship and smart budget smartphones. Authentic products, unmatched pricing, and rapid delivery across India.
          </p>
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">🐦</a>
            <a href="#instagram" aria-label="Instagram">📸</a>
            <a href="#youtube" aria-label="YouTube">▶️</a>
            <a href="#linkedin" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Top Brands</h4>
          <ul className="footer-links">
            <li><Link to="/mobiles?brand=Apple">Apple iPhones</Link></li>
            <li><Link to="/mobiles?brand=Samsung">Samsung Galaxy</Link></li>
            <li><Link to="/mobiles?brand=Google">Google Pixel</Link></li>
            <li><Link to="/mobiles?brand=OnePlus">OnePlus Series</Link></li>
            <li><Link to="/mobiles?brand=Xiaomi">Xiaomi & Redmi</Link></li>
            <li><Link to="/mobiles?brand=Nothing">Nothing Phone</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mobiles">Browse All Mobiles</Link></li>
            <li><Link to="/compare">Compare Smartphones</Link></li>
            <li><Link to="/add-mobile">Add New Mobile</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Special Offers</h4>
          <p className="footer-text">Use coupon code <span className="highlight-code">SAVE10</span> to get 10% off on your first order!</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ElectroMob Store Inc. Built with React & Vite. All rights reserved.</p>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
