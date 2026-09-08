import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { useCart } from "../context/CartContext";
import { mobileService } from "../services/api";

function Compare() {
  const { compareItems, removeFromCompare, clearCompare, toggleCompare } = useCompare();
  const { addToCart } = useCart();
  const [allMobiles, setAllMobiles] = useState([]);
  const [selectedMobileId, setSelectedMobileId] = useState("");

  useEffect(() => {
    mobileService.getAll().then((data) => setAllMobiles(data));
  }, []);

  const handleAddSelect = (e) => {
    const id = e.target.value;
    setSelectedMobileId(id);
    if (!id) return;
    const phone = allMobiles.find((m) => String(m.id) === String(id));
    if (phone) {
      toggleCompare(phone);
      setSelectedMobileId("");
    }
  };

  if (compareItems.length === 0) {
    return (
      <div className="compare-empty-page">
        <div className="compare-empty-card">
          <span className="compare-icon">⇄</span>
          <h2>Smartphone Comparison Tool</h2>
          <p>
            You haven't added any smartphones to compare yet. Select up to 4 devices to view specs, cameras, batteries, and prices side-by-side.
          </p>

          <div className="quick-select-compare">
            <label>Quick select a phone to start comparing:</label>
            <select value={selectedMobileId} onChange={handleAddSelect} className="select-compare">
              <option value="">-- Choose a Smartphone --</option>
              {allMobiles.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.name} (₹{Number(m.price).toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "20px" }}>
            <Link to="/mobiles" className="btn-primary">
              Browse All Smartphones →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/mobiles">Mobiles</Link> / <span>Compare Phones</span>
      </nav>

      <div className="compare-header">
        <div>
          <h1>Compare Smartphones</h1>
          <p>Comparing {compareItems.length} smartphone{compareItems.length > 1 ? "s" : ""}</p>
        </div>
        <div className="compare-header-actions">
          {compareItems.length < 4 && (
            <select
              value={selectedMobileId}
              onChange={handleAddSelect}
              className="select-compare header-select"
            >
              <option value="">+ Add Another Phone</option>
              {allMobiles
                .filter((m) => !compareItems.some((c) => c.id === m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    + {m.brand} {m.name}
                  </option>
                ))}
            </select>
          )}
          <button className="btn-clear-cart" onClick={clearCompare}>
            Clear All
          </button>
        </div>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="feature-col">Feature / Device</th>
              {compareItems.map((item) => (
                <th key={item.id} className="phone-col">
                  <div className="compare-card-head">
                    <button
                      className="btn-remove-compare"
                      onClick={() => removeFromCompare(item.id)}
                      title="Remove from comparison"
                    >
                      ×
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="compare-thumb"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                    <span className="brand-pill">{item.brand}</span>
                    <h3>{item.name}</h3>
                    <div className="compare-price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                    <button
                      className="btn-add-cart full-width"
                      onClick={() => addToCart(item)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="feature-col">⭐ Customer Rating</td>
              {compareItems.map((item) => (
                <td key={item.id}>
                  <strong>{item.rating || 4.5} / 5.0</strong>
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🧠 Processor / Chipset</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.processor || "Flagship SoC"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">💾 RAM Capacity</td>
              {compareItems.map((item) => (
                <td key={item.id}><strong>{item.ram || "8 GB"}</strong></td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🗄️ Internal Storage</td>
              {compareItems.map((item) => (
                <td key={item.id}><strong>{item.storage || "256 GB"}</strong></td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">📸 Camera System</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.camera || "Multi-Lens Pro Camera"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🔋 Battery & Charging</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.battery || "5000 mAh"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🖥️ Display Specs</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.display || "120Hz OLED Display"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">⚙️ Operating System</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.os || "Android / iOS"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">⚡ 5G Ready</td>
              {compareItems.map((item) => (
                <td key={item.id}>{item.is5G ? "✓ Yes (Dual 5G)" : "No"}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🎨 Colors</td>
              {compareItems.map((item) => (
                <td key={item.id}>
                  {Array.isArray(item.colors) ? item.colors.join(", ") : item.colors || "Standard"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-col">🔗 Quick Actions</td>
              {compareItems.map((item) => (
                <td key={item.id}>
                  <Link to={`/mobiles/${item.id}`} className="view-details-link">
                    View Full Details →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;
