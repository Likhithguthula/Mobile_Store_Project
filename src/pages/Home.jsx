import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mobileService } from "../services/api";
import MobileCard from "../components/MobileCard";

const BRANDS = [
  { name: "Apple", logo: "🍎", count: "iPhone 16 Series" },
  { name: "Samsung", logo: "🪐", count: "Galaxy S25 & Z Fold" },
  { name: "Google", logo: "🔍", count: "Pixel 9 Pro AI" },
  { name: "OnePlus", logo: "⚡", count: "OnePlus 13 & Nord" },
  { name: "Xiaomi", logo: "📸", count: "Xiaomi 15 Pro Leica" },
  { name: "Nothing", logo: "💡", count: "Phone (2a) Glyph" },
  { name: "Realme", logo: "🚀", count: "GT 6 Speed Edition" },
  { name: "Motorola", logo: "🪵", count: "Edge 50 Ultra" },
];

function Home() {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMobiles();
  }, []);

  const loadMobiles = async () => {
    try {
      setLoading(true);
      const data = await mobileService.getAll();
      setMobiles(data);
    } catch (err) {
      console.error("Failed to load mobiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMobiles = mobiles.filter((m) => m.featured).slice(0, 4);
  const dealMobiles = mobiles
    .filter((m) => m.originalPrice && m.originalPrice > m.price)
    .slice(0, 4);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">⚡ Next-Gen Smartphones 2026</span>
          <h1 className="hero-title">
            Unleash Power with the Latest <span className="text-gradient">Flagship Mobiles</span>
          </h1>
          <p className="hero-subtitle">
            Experience next-level AI performance, titanium craftsmanship, and cinematic camera systems. Best prices, instant bank discounts, and 24-hour express shipping.
          </p>
          <div className="hero-actions">
            <Link to="/mobiles" className="btn-primary">
              Explore All Mobiles →
            </Link>
            <Link to="/compare" className="btn-secondary">
              Compare Specs ⇄
            </Link>
            <Link to="/add-mobile" className="btn-outline">
              + Add New Device
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <strong>100%</strong>
              <span>Authentic</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>50,000+</strong>
              <span>Happy Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <strong>24h</strong>
              <span>Fast Shipping</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-card-glow"></div>
          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80"
            alt="Flagship Smartphone"
            className="hero-phone-img"
          />
          <div className="floating-hero-pill pill-top">
            <span>⭐ 4.9 Rated</span>
            <strong>iPhone 16 Pro Max</strong>
          </div>
          <div className="floating-hero-pill pill-bottom">
            <span>🔥 Snapdragon 8 Elite</span>
            <strong>Galaxy S25 Ultra</strong>
          </div>
        </div>
      </section>

      {/* BRAND QUICK EXPLORER */}
      <section className="brands-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop By Brand</h2>
            <p className="section-subtitle">Select your favorite manufacturer to view curated smartphones</p>
          </div>
        </div>
        <div className="brands-grid">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="brand-card"
              onClick={() => navigate(`/mobiles?brand=${b.name}`)}
            >
              <div className="brand-card-icon">{b.logo}</div>
              <h3 className="brand-card-name">{b.name}</h3>
              <p className="brand-card-models">{b.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED FLAGSHIPS */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">✨ Featured Flagships</h2>
            <p className="section-subtitle">The most sought-after smartphones with cutting-edge technology</p>
          </div>
          <Link to="/mobiles" className="view-all-link">
            View All Mobiles &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner-box">
            <div className="spinner"></div>
            <p>Loading smartphones...</p>
          </div>
        ) : (
          <div className="mobiles-grid">
            {(featuredMobiles.length ? featuredMobiles : mobiles.slice(0, 4)).map((mobile) => (
              <MobileCard key={mobile.id} mobile={mobile} />
            ))}
          </div>
        )}
      </section>

      {/* DEALS OF THE DAY */}
      <section className="deals-section">
        <div className="deals-banner">
          <div className="deals-banner-content">
            <span className="badge-deal">Limited Time Offer</span>
            <h2>Get Flat ₹5,000 Off with Coupon <span className="coupon-tag">ELECTRO5000</span></h2>
            <p>Upgrade to 5G today and enjoy exclusive cashback and instant exchange bonuses.</p>
            <Link to="/mobiles" className="btn-deal">Shop Discounted Deals</Link>
          </div>
        </div>

        <div className="section-header" style={{ marginTop: "40px" }}>
          <div>
            <h2 className="section-title">🔥 Top Discounted Smartphones</h2>
            <p className="section-subtitle">Grab these incredible savings before stock runs out</p>
          </div>
        </div>

        <div className="mobiles-grid">
          {dealMobiles.map((mobile) => (
            <MobileCard key={mobile.id} mobile={mobile} />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="add-cta-banner">
        <div className="cta-content">
          <h2>Have a new phone model to list?</h2>
          <p>Easily publish new smartphones with detailed specs, pricing, and high-res photography.</p>
          <Link to="/add-mobile" className="btn-primary">
            + Add New Mobile Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
