import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { mobileService } from "../services/api";
import { useToast } from "../context/ToastContext";

const SAMPLE_IMAGES = [
  { label: "Titanium / Flagship", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80" },
  { label: "Modern Blue", url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80" },
  { label: "Minimal Dark", url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80" },
  { label: "Glossy Black", url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80" },
];

function AddMobile() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    brand: "Apple",
    name: "",
    price: "",
    originalPrice: "",
    image: SAMPLE_IMAGES[0].url,
    rating: 4.8,
    ram: "8 GB",
    storage: "256 GB",
    processor: "",
    camera: "",
    battery: "5000 mAh",
    display: "6.7-inch AMOLED 120Hz",
    os: "Android 15",
    is5G: true,
    inStock: true,
    tag: "New Launch",
    colors: "Black, Silver, Blue",
    description: "",
    features: "120Hz LTPO Display\n50MP Ultra-Clear Camera\nAll-Day Battery Life\nFast Charging Support",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      addToast("Please fill in the required name and price fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        rating: Number(formData.rating) || 4.5,
        colors: formData.colors
          ? formData.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : ["Standard"],
        features: formData.features
          ? formData.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : [],
      };

      await mobileService.create(formattedData);
      addToast(`Added "${formData.name}" to smartphone catalog!`, "success");
      navigate("/mobiles");
    } catch (err) {
      console.error(err);
      addToast("Failed to add mobile phone. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/mobiles">Mobiles</Link> / <span>Add New Mobile</span>
      </nav>

      <div className="form-header">
        <h1>Add New Smartphone</h1>
        <p>List a new phone model into the ElectroMob store database with detailed specifications</p>
      </div>

      <div className="form-layout">
        {/* Form Main */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="form-group">
                <label>Brand *</label>
                <select name="brand" value={formData.brand} onChange={handleChange} required>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Nothing">Nothing</option>
                  <option value="Realme">Realme</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Other">Other Brand</option>
                </select>
              </div>

              <div className="form-group">
                <label>Model / Phone Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. iPhone 16 Pro or Galaxy S25"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 79999"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Original / MRP Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="e.g. 89999"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Rating (1.0 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL *</label>
              <input
                type="url"
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
                required
              />
              <div className="quick-image-pills">
                <span className="helper-txt">Quick pick sample image:</span>
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    className="btn-sample-img"
                    onClick={() => setFormData({ ...formData, image: img.url })}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>RAM</label>
                <select name="ram" value={formData.ram} onChange={handleChange}>
                  <option value="6 GB">6 GB</option>
                  <option value="8 GB">8 GB</option>
                  <option value="12 GB">12 GB</option>
                  <option value="16 GB">16 GB</option>
                  <option value="24 GB">24 GB</option>
                </select>
              </div>

              <div className="form-group">
                <label>Storage</label>
                <select name="storage" value={formData.storage} onChange={handleChange}>
                  <option value="128 GB">128 GB</option>
                  <option value="256 GB">256 GB</option>
                  <option value="512 GB">512 GB</option>
                  <option value="1 TB">1 TB</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tag / Promotional Badge</label>
                <input
                  type="text"
                  name="tag"
                  placeholder="e.g. Flagship King, Best Seller"
                  value={formData.tag}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Processor / Chipset</label>
                <input
                  type="text"
                  name="processor"
                  placeholder="e.g. Snapdragon 8 Elite / A18 Pro"
                  value={formData.processor}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Camera Setup</label>
                <input
                  type="text"
                  name="camera"
                  placeholder="e.g. 50MP + 50MP + 12MP Triple OIS"
                  value={formData.camera}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Battery</label>
                <input
                  type="text"
                  name="battery"
                  placeholder="e.g. 5000 mAh 80W"
                  value={formData.battery}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Display</label>
                <input
                  type="text"
                  name="display"
                  placeholder="e.g. 6.8-inch AMOLED 120Hz"
                  value={formData.display}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Operating System</label>
                <input
                  type="text"
                  name="os"
                  placeholder="e.g. Android 15 / iOS 18"
                  value={formData.os}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Colors (Comma separated)</label>
              <input
                type="text"
                name="colors"
                placeholder="e.g. Titanium Black, Silver, Glacier Blue"
                value={formData.colors}
                onChange={handleChange}
              />
            </div>

            <div className="form-row-2 checkboxes-form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is5G"
                  checked={formData.is5G}
                  onChange={handleChange}
                />
                <span>5G Network Capable</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                <span>In Stock & Ready to Ship</span>
              </label>
            </div>

            <div className="form-group">
              <label>Overview & Description</label>
              <textarea
                name="description"
                placeholder="Describe key design, performance, and highlights..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Key Features (One feature per line)</label>
              <textarea
                name="features"
                placeholder="Key feature line 1&#10;Key feature line 2"
                value={formData.features}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions-row">
              <Link to="/mobiles" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "✓ Publish Smartphone"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="preview-panel">
          <h3>📱 Live Preview Card</h3>
          <p className="preview-sub">Here is how this smartphone will appear in store listings:</p>
          <div className="mobile-card preview-card">
            <div className="card-top-badges">
              {formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
                <span className="badge-discount">
                  {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
                </span>
              )}
              {formData.tag && <span className="badge-tag">{formData.tag}</span>}
            </div>

            <div className="card-image-wrap">
              <img
                src={formData.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"}
                alt="Preview"
                className="card-image"
              />
            </div>

            <div className="card-body">
              <div className="card-meta">
                <span className="brand-pill">{formData.brand}</span>
                <span className="rating-pill">⭐ {formData.rating || 4.5}</span>
              </div>
              <h3 className="card-title">{formData.name || "Smartphone Model Name"}</h3>
              <div className="specs-chips">
                <span className="chip">{formData.ram} RAM</span>
                <span className="chip">{formData.storage}</span>
                <span className="chip">🔋 {formData.battery}</span>
                {formData.is5G && <span className="chip chip-5g">5G</span>}
              </div>
              <div className="price-box">
                <span className="current-price">₹{Number(formData.price || 0).toLocaleString("en-IN")}</span>
                {formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
                  <span className="original-price">₹{Number(formData.originalPrice).toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMobile;
