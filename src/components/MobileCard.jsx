import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";

function MobileCard({ mobile, onDelete }) {
  const { addToCart } = useCart();
  const { toggleCompare, isComparing } = useCompare();

  const discountPercent =
    mobile.originalPrice && mobile.originalPrice > mobile.price
      ? Math.round(((mobile.originalPrice - mobile.price) / mobile.originalPrice) * 100)
      : null;

  return (
    <div className="mobile-card">
      {/* Top badges */}
      <div className="card-top-badges">
        {discountPercent ? (
          <span className="badge-discount">{discountPercent}% OFF</span>
        ) : null}
        {mobile.tag && <span className="badge-tag">{mobile.tag}</span>}
      </div>

      {/* Product Image */}
      <Link to={`/mobiles/${mobile.id}`} className="card-image-wrap">
        <img
          src={mobile.image}
          alt={mobile.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
          }}
        />
      </Link>

      <div className="card-body">
        {/* Brand and Rating */}
        <div className="card-meta">
          <span className="brand-pill">{mobile.brand}</span>
          <span className="rating-pill">⭐ {mobile.rating || 4.5}</span>
        </div>

        {/* Title */}
        <h3 className="card-title">
          <Link to={`/mobiles/${mobile.id}`}>{mobile.name}</Link>
        </h3>

        {/* Specs Pills */}
        <div className="specs-chips">
          {mobile.ram && <span className="chip">{mobile.ram} RAM</span>}
          {mobile.storage && <span className="chip">{mobile.storage}</span>}
          {mobile.battery && <span className="chip">🔋 {mobile.battery}</span>}
          {mobile.is5G && <span className="chip chip-5g">5G</span>}
        </div>

        {/* Pricing */}
        <div className="price-box">
          <span className="current-price">₹{Number(mobile.price).toLocaleString("en-IN")}</span>
          {mobile.originalPrice && Number(mobile.originalPrice) > Number(mobile.price) && (
            <span className="original-price">
              ₹{Number(mobile.originalPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Primary Actions: Add to Cart & Compare */}
        <div className="card-primary-actions">
          <button
            className="btn-add-cart"
            onClick={() => addToCart(mobile)}
          >
            🛒 Add to Cart
          </button>
          <button
            className={`btn-compare ${isComparing(mobile.id) ? "btn-comparing" : ""}`}
            onClick={() => toggleCompare(mobile)}
            title={isComparing(mobile.id) ? "Remove from compare" : "Add to compare"}
          >
            {isComparing(mobile.id) ? "✓ Compared" : "⇄ Compare"}
          </button>
        </div>

        {/* Secondary Actions: View, Edit, Delete */}
        <div className="card-management-actions">
          <Link to={`/mobiles/${mobile.id}`} className="action-btn btn-view">
            View Details
          </Link>
          <Link to={`/edit-mobile/${mobile.id}`} className="action-btn btn-edit">
            ✏️ Edit
          </Link>
          {onDelete && (
            <button
              className="action-btn btn-delete"
              onClick={() => onDelete(mobile.id, mobile.name)}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileCard;
