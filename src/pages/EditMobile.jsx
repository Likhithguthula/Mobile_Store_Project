import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mobileService } from "../services/api";
import { useToast } from "../context/ToastContext";

function EditMobile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    rating: 4.5,
    ram: "8 GB",
    storage: "256 GB",
    processor: "",
    camera: "",
    battery: "",
    display: "",
    os: "",
    is5G: true,
    inStock: true,
    tag: "",
    colors: "",
    description: "",
    features: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMobile();
  }, [id]);

  const loadMobile = async () => {
    try {
      setLoading(true);
      const data = await mobileService.getById(id);
      setFormData({
        ...data,
        colors: Array.isArray(data.colors) ? data.colors.join(", ") : data.colors || "",
        features: Array.isArray(data.features) ? data.features.join("\n") : data.features || "",
      });
    } catch (err) {
      console.error(err);
      addToast("Could not load device data for editing", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      addToast("Name and Price are required", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        rating: Number(formData.rating) || 4.5,
        colors: typeof formData.colors === "string"
          ? formData.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : formData.colors,
        features: typeof formData.features === "string"
          ? formData.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : formData.features,
      };

      await mobileService.update(id, formattedData);
      addToast(`Updated "${formData.name}" successfully!`, "success");
      navigate(`/mobiles/${id}`);
    } catch (err) {
      console.error(err);
      addToast("Failed to update smartphone details", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading smartphone details for edit...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/mobiles">Mobiles</Link> /{" "}
        <Link to={`/mobiles/${id}`}>{formData.name}</Link> / <span>Edit Device</span>
      </nav>

      <div className="form-header">
        <h1>Edit Smartphone Details</h1>
        <p>Update specifications, pricing, and media for {formData.name}</p>
      </div>

      <div className="form-layout single-col">
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
                value={formData.image}
                onChange={handleChange}
                required
              />
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
                  value={formData.tag || ""}
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
                  value={formData.processor || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Camera Setup</label>
                <input
                  type="text"
                  name="camera"
                  value={formData.camera || ""}
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
                  value={formData.battery || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Display</label>
                <input
                  type="text"
                  name="display"
                  value={formData.display || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Operating System</label>
                <input
                  type="text"
                  name="os"
                  value={formData.os || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Colors (Comma separated)</label>
              <input
                type="text"
                name="colors"
                value={formData.colors || ""}
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
                <span>In Stock & Available</span>
              </label>
            </div>

            <div className="form-group">
              <label>Overview & Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Key Features (One feature per line)</label>
              <textarea
                name="features"
                value={formData.features || ""}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions-row">
              <Link to={`/mobiles/${id}`} className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "💾 Update Smartphone"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditMobile;
