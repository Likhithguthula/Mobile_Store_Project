import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mobileService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";
import MobileCard from "../components/MobileCard";

function MobileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleCompare, isComparing } = useCompare();
  const { addToast } = useToast();

  const [mobile, setMobile] = useState(null);
  const [relatedMobiles, setRelatedMobiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMobileData();
  }, [id]);

  const loadMobileData = async () => {
    try {
      setLoading(true);
      const data = await mobileService.getById(id);
      setMobile(data);
      if (data.colors && data.colors.length) {
        setSelectedColor(data.colors[0]);
      }

      // Fetch reviews
      const revs = await mobileService.getReviews(id);
      setReviews(revs);

      // Fetch related mobiles (same brand or similar price)
      const all = await mobileService.getAll();
      const related = all
        .filter((m) => String(m.id) !== String(id) && (m.brand === data.brand || Math.abs(m.price - data.price) < 25000))
        .slice(0, 3);
      setRelatedMobiles(related);
    } catch (err) {
      console.error("Failed to load phone details:", err);
      addToast("Could not find requested mobile phone.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!mobile) return;
    addToCart(mobile, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    if (!mobile) return;
    addToCart(mobile, quantity, selectedColor);
    navigate("/cart");
  };

  const handleDeleteMobile = async () => {
    try {
      await mobileService.delete(id);
      addToast(`Deleted ${mobile.name} successfully`, "success");
      navigate("/mobiles");
    } catch {
      addToast("Failed to delete phone", "error");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      addToast("Please provide your name and review message", "error");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const newRev = await mobileService.addReview({
        mobileId: String(id),
        author: reviewAuthor.trim(),
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });
      setReviews([newRev, ...reviews]);
      setReviewAuthor("");
      setReviewComment("");
      setReviewRating(5);
      addToast("Thank you! Your review was submitted.", "success");
    } catch {
      addToast("Failed to post review. Please try again.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading smartphone specs...</p>
      </div>
    );
  }

  if (!mobile) {
    return (
      <div className="error-container">
        <h2>Smartphone Not Found</h2>
        <p>The device you requested is unavailable or has been removed.</p>
        <Link to="/mobiles" className="btn-primary">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const discountPercent =
    mobile.originalPrice && mobile.originalPrice > mobile.price
      ? Math.round(((mobile.originalPrice - mobile.price) / mobile.originalPrice) * 100)
      : null;

  return (
    <div className="details-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/mobiles">Mobiles</Link> /{" "}
        <Link to={`/mobiles?brand=${mobile.brand}`}>{mobile.brand}</Link> /{" "}
        <span>{mobile.name}</span>
      </nav>

      <div className="details-hero-grid">
        {/* Left: Product Media Gallery */}
        <div className="details-media">
          <div className="main-image-frame">
            <img
              src={mobile.image}
              alt={mobile.name}
              className="details-main-img"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
              }}
            />
            {discountPercent && (
              <span className="details-discount-badge">{discountPercent}% OFF</span>
            )}
          </div>

          {/* Color Switcher */}
          {mobile.colors && mobile.colors.length > 0 && (
            <div className="color-selector-box">
              <h4>Available Colors:</h4>
              <div className="color-pills-row">
                {mobile.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-pill ${selectedColor === color ? "active" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info, Price & Actions */}
        <div className="details-summary">
          <div className="brand-tag-row">
            <span className="brand-tag">{mobile.brand}</span>
            {mobile.tag && <span className="custom-tag">{mobile.tag}</span>}
            {mobile.is5G && <span className="badge-5g">⚡ 5G Ready</span>}
          </div>

          <h1 className="details-title">{mobile.name}</h1>

          {/* Rating */}
          <div className="details-rating-row">
            <div className="rating-stars">
              {"★".repeat(Math.round(mobile.rating || 5))}
              {"☆".repeat(5 - Math.round(mobile.rating || 5))}
            </div>
            <span className="rating-val">{mobile.rating || 4.5}</span>
            <span className="rating-count">({reviews.length} Customer Reviews)</span>
          </div>

          {/* Pricing Box */}
          <div className="details-price-card">
            <div className="price-row">
              <span className="details-price">
                ₹{Number(mobile.price).toLocaleString("en-IN")}
              </span>
              {mobile.originalPrice && Number(mobile.originalPrice) > Number(mobile.price) && (
                <span className="details-old-price">
                  ₹{Number(mobile.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="tax-inclusive">Inclusive of all taxes & free standard shipping</p>
          </div>

          <p className="details-description">{mobile.description}</p>

          {/* Quick Specs Highlight Box */}
          <div className="quick-specs-grid">
            <div className="quick-spec-item">
              <span className="q-icon">🧠</span>
              <div>
                <strong>Processor</strong>
                <p>{mobile.processor || "Flagship SoC"}</p>
              </div>
            </div>
            <div className="quick-spec-item">
              <span className="q-icon">💾</span>
              <div>
                <strong>RAM & Storage</strong>
                <p>{mobile.ram || "8 GB"} | {mobile.storage || "128 GB"}</p>
              </div>
            </div>
            <div className="quick-spec-item">
              <span className="q-icon">📸</span>
              <div>
                <strong>Primary Camera</strong>
                <p>{mobile.camera || "Pro Multi-Camera"}</p>
              </div>
            </div>
            <div className="quick-spec-item">
              <span className="q-icon">🔋</span>
              <div>
                <strong>Battery & Charge</strong>
                <p>{mobile.battery || "5000 mAh"}</p>
              </div>
            </div>
          </div>

          {/* Quantity and Cart Actions */}
          <div className="cart-action-panel">
            <div className="quantity-control">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-num">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button className="btn-add-to-cart-large" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>

            <button className="btn-buy-now-large" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>

          {/* Compare & Admin Management Actions */}
          <div className="details-admin-bar">
            <button
              className={`btn-compare-detail ${isComparing(mobile.id) ? "active" : ""}`}
              onClick={() => toggleCompare(mobile)}
            >
              {isComparing(mobile.id) ? "✓ Added to Compare" : "⇄ Add to Compare"}
            </button>
            <Link to={`/edit-mobile/${mobile.id}`} className="btn-edit-detail">
              ✏️ Edit Device Specs
            </Link>
            <button
              className="btn-delete-detail"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Delete Device
            </button>
          </div>
        </div>
      </div>

      {/* FULL TECHNICAL SPECIFICATIONS TABLE */}
      <section className="specs-section">
        <h2 className="section-title">📊 Full Technical Specifications</h2>
        <div className="specs-table-wrapper">
          <table className="specs-table">
            <tbody>
              <tr>
                <th>Brand / Manufacturer</th>
                <td>{mobile.brand}</td>
              </tr>
              <tr>
                <th>Model Name</th>
                <td>{mobile.name}</td>
              </tr>
              <tr>
                <th>Display</th>
                <td>{mobile.display || "AMOLED High Refresh Rate"}</td>
              </tr>
              <tr>
                <th>Processor / Chipset</th>
                <td>{mobile.processor || "Next-Gen Mobile Platform"}</td>
              </tr>
              <tr>
                <th>RAM Capacity</th>
                <td>{mobile.ram || "8 GB"}</td>
              </tr>
              <tr>
                <th>Internal Storage</th>
                <td>{mobile.storage || "128 GB"}</td>
              </tr>
              <tr>
                <th>Camera System</th>
                <td>{mobile.camera || "Ultra-Clear Multi-Lens Setup"}</td>
              </tr>
              <tr>
                <th>Battery Capacity</th>
                <td>{mobile.battery || "5000 mAh Fast Charging"}</td>
              </tr>
              <tr>
                <th>Operating System</th>
                <td>{mobile.os || "Android / iOS"}</td>
              </tr>
              <tr>
                <th>5G Network Support</th>
                <td>{mobile.is5G ? "Yes, Dual 5G SIM" : "4G VoLTE"}</td>
              </tr>
              <tr>
                <th>Color Variants</th>
                <td>{mobile.colors ? mobile.colors.join(", ") : "Standard Colors"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Features Bullet List */}
        {mobile.features && mobile.features.length > 0 && (
          <div className="features-list-card">
            <h3>✨ Key Highlights & Capabilities</h3>
            <ul>
              {mobile.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* REVIEWS & RATINGS SECTION */}
      <section className="reviews-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">⭐ Customer Reviews & Feedback</h2>
            <p className="section-subtitle">Real feedback from verified smartphone owners</p>
          </div>
        </div>

        <div className="reviews-layout">
          {/* Review List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {rev.author ? rev.author[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <strong>{rev.author}</strong>
                        <span className="review-date">{rev.date || "Verified Purchase"}</span>
                      </div>
                    </div>
                    <div className="review-stars">
                      {"★".repeat(rev.rating || 5)}
                      {"☆".repeat(5 - (rev.rating || 5))}
                    </div>
                  </div>
                  <p className="review-text">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="write-review-card">
            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                  <option value={1}>⭐ (1 - Disappointed)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Feedback</label>
                <textarea
                  placeholder="Share details about performance, battery life, camera quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                disabled={isSubmittingReview}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RELATED SMARTPHONES */}
      {relatedMobiles.length > 0 && (
        <section className="related-section">
          <h2 className="section-title">📱 You May Also Like</h2>
          <div className="mobiles-grid">
            {relatedMobiles.map((item) => (
              <MobileCard key={item.id} mobile={item} />
            ))}
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete Smartphone?</h3>
            <p>
              Are you sure you want to remove <strong>{mobile.name}</strong> from the store? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn-modal-danger" onClick={handleDeleteMobile}>
                Yes, Delete Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileDetails;
