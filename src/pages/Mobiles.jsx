import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { mobileService } from "../services/api";
import MobileCard from "../components/MobileCard";
import { useToast } from "../context/ToastContext";

const BRAND_LIST = ["All", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Nothing", "Realme", "Motorola"];

function Mobiles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "All");
  const [maxPrice, setMaxPrice] = useState(160000);
  const [selectedRam, setSelectedRam] = useState("All");
  const [only5G, setOnly5G] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Mobile delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    loadMobiles();
  }, []);

  // Synchronize state when URL query parameters change
  useEffect(() => {
    const q = searchParams.get("q");
    const b = searchParams.get("brand");
    if (q !== null) setSearchTerm(q);
    if (b !== null) setSelectedBrand(b);
  }, [searchParams]);

  const loadMobiles = async () => {
    try {
      setLoading(true);
      const data = await mobileService.getAll();
      setMobiles(data);
    } catch (err) {
      console.error("Failed to fetch mobiles", err);
      addToast("Failed to load smartphones. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await mobileService.delete(deleteModal.id);
      setMobiles((prev) => prev.filter((m) => m.id !== deleteModal.id));
      addToast(`Deleted ${deleteModal.name} successfully`, "success");
    } catch {
      addToast("Could not delete device. Try again.", "error");
    } finally {
      setDeleteModal({ open: false, id: null, name: "" });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setMaxPrice(160000);
    setSelectedRam("All");
    setOnly5G(false);
    setInStockOnly(false);
    setSortBy("featured");
    setSearchParams({});
  };

  // Filter & Sort computation
  const filteredMobiles = useMemo(() => {
    let result = [...mobiles];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          (m.processor && m.processor.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== "All") {
      result = result.filter((m) => m.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Price filter
    result = result.filter((m) => Number(m.price) <= maxPrice);

    // RAM filter
    if (selectedRam !== "All") {
      result = result.filter((m) => m.ram && m.ram.includes(selectedRam));
    }

    // 5G filter
    if (only5G) {
      result = result.filter((m) => m.is5G);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((m) => m.inStock !== false);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [mobiles, searchTerm, selectedBrand, maxPrice, selectedRam, only5G, inStockOnly, sortBy]);

  return (
    <div className="catalog-page">
      {/* Page Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Explore Smartphones</h1>
          <p className="catalog-subtitle">
            Showing {filteredMobiles.length} of {mobiles.length} available models
          </p>
        </div>
        <Link to="/add-mobile" className="btn-primary add-mobile-header-btn">
          + Add New Mobile
        </Link>
      </div>

      {/* Brand Horizontal Filter Bar */}
      <div className="brand-pills-bar">
        {BRAND_LIST.map((brand) => (
          <button
            key={brand}
            className={`brand-filter-pill ${selectedBrand.toLowerCase() === brand.toLowerCase() ? "active" : ""}`}
            onClick={() => {
              setSelectedBrand(brand);
              if (brand === "All") {
                searchParams.delete("brand");
              } else {
                searchParams.set("brand", brand);
              }
              setSearchParams(searchParams);
            }}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="catalog-layout">
        {/* FILTERS SIDEBAR */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <div className="filter-header-flex">
              <h3>Filters</h3>
              <button className="btn-reset" onClick={resetFilters}>
                Reset All
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search by model, specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Max Price Range Slider */}
          <div className="filter-group">
            <div className="filter-label-flex">
              <label className="filter-label">Max Price</label>
              <span className="price-tag-value">₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="160000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-bounds">
              <span>₹15k</span>
              <span>₹1.6L</span>
            </div>
          </div>

          {/* RAM Filter */}
          <div className="filter-group">
            <label className="filter-label">RAM Capacity</label>
            <select
              value={selectedRam}
              onChange={(e) => setSelectedRam(e.target.value)}
              className="filter-select"
            >
              <option value="All">Any RAM</option>
              <option value="6 GB">6 GB</option>
              <option value="8 GB">8 GB</option>
              <option value="12 GB">12 GB</option>
              <option value="16 GB">16 GB</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="filter-group checkboxes-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={only5G}
                onChange={(e) => setOnly5G(e.target.checked)}
              />
              <span>5G Enabled Only</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* MOBILES CONTENT */}
        <main className="catalog-main">
          {/* Top Sort & Count Bar */}
          <div className="sort-bar">
            <span className="results-count">
              <strong>{filteredMobiles.length}</strong> phones found
            </span>
            <div className="sort-selector">
              <label htmlFor="sort-dropdown">Sort by:</label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
                <option value="name">Name (A - Z)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner-box">
              <div className="spinner"></div>
              <p>Fetching smartphone catalog...</p>
            </div>
          ) : filteredMobiles.length === 0 ? (
            <div className="empty-catalog-state">
              <span className="empty-icon">📱</span>
              <h3>No Smartphones Match Your Criteria</h3>
              <p>Try resetting filters or searching with a different keyword.</p>
              <button className="btn-primary" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="mobiles-grid">
              {filteredMobiles.map((mobile) => (
                <MobileCard
                  key={mobile.id}
                  mobile={mobile}
                  onDelete={handleDeletePrompt}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Delete Modal */}
      {deleteModal.open && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete Smartphone?</h3>
            <p>
              Are you sure you want to permanently remove <strong>{deleteModal.name}</strong> from the catalog?
            </p>
            <div className="modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
              >
                Cancel
              </button>
              <button className="btn-modal-danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mobiles;
