import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    tax,
    shipping,
    grandTotal,
  } = useCart();

  const { addToast } = useToast();

  const [inputCoupon, setInputCoupon] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "UPI",
  });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon("");
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      addToast("Please fill in your shipping details", "error");
      return;
    }

    const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
    addToast("Order placed successfully! 🚀", "success");
  };

  if (orderPlaced) {
    return (
      <div className="order-success-page">
        <div className="order-success-card">
          <div className="success-checkmark">🎉</div>
          <h1>Order Confirmed!</h1>
          <p className="order-num">
            Order Reference ID: <strong>#{orderId}</strong>
          </p>
          <p className="order-msg">
            Thank you for shopping with ElectroMob! We are packing your smartphones and will dispatch them within 24 hours. A confirmation SMS has been sent to <strong>{checkoutForm.phone}</strong>.
          </p>
          <div className="order-details-box">
            <p><strong>Shipping to:</strong> {checkoutForm.name}, {checkoutForm.address}, {checkoutForm.city} - {checkoutForm.pincode}</p>
            <p><strong>Payment Mode:</strong> {checkoutForm.paymentMethod}</p>
          </div>
          <Link
            to="/mobiles"
            className="btn-primary"
            onClick={() => setOrderPlaced(false)}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-card">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your Shopping Cart is Empty</h2>
          <p>Looks like you haven't added any smartphones to your bag yet.</p>
          <Link to="/mobiles" className="btn-primary">
            Explore Latest Smartphones →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/mobiles">Mobiles</Link> / <span>Shopping Cart</span>
      </nav>

      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review items in your cart and proceed to secure checkout</p>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <h3>Items in Bag ({cartItems.length})</h3>
            <button className="btn-clear-cart" onClick={clearCart}>
              Clear Entire Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedColor}`} className="cart-item-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80";
                  }}
                />

                <div className="cart-item-info">
                  <div className="item-meta">
                    <span className="brand-tag">{item.brand}</span>
                    <span className="color-tag">Color: {item.selectedColor}</span>
                  </div>

                  <h3 className="cart-item-title">
                    <Link to={`/mobiles/${item.id}`}>{item.name}</Link>
                  </h3>

                  <p className="cart-item-specs">
                    {item.ram} RAM • {item.storage}
                  </p>

                  <div className="cart-item-price-unit">
                    ₹{Number(item.price).toLocaleString("en-IN")} each
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control small">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1, item.selectedColor)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1, item.selectedColor)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>

                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id, item.selectedColor)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>

            {/* Coupon input */}
            <form className="coupon-box" onSubmit={handleApplyCoupon}>
              <input
                type="text"
                placeholder="Coupon (e.g. SAVE10)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="btn-apply-coupon">
                Apply
              </button>
            </form>

            <div className="coupon-suggestions">
              <span>Try: </span>
              <button
                type="button"
                className="pill-code"
                onClick={() => applyCoupon("SAVE10")}
              >
                SAVE10 (10% OFF)
              </button>
              <button
                type="button"
                className="pill-code"
                onClick={() => applyCoupon("ELECTRO5000")}
              >
                ELECTRO5000 (₹5,000 OFF)
              </button>
            </div>

            {coupon.code && (
              <div className="applied-coupon-row">
                <span>
                  ✓ Applied: <strong>{coupon.code}</strong>
                </span>
                <button className="btn-remove-coupon" onClick={removeCoupon}>
                  Remove
                </button>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-line discount-line">
                <span>Coupon Discount</span>
                <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="summary-line">
              <span>Estimated GST (18%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-line">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-line grand-total-line">
              <span>Total Payable</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <button
              className="btn-checkout-primary"
              onClick={() => setShowCheckoutModal(true)}
            >
              Proceed to Checkout →
            </button>

            <p className="secure-badge">🔒 256-Bit SSL Encrypted & 100% Safe</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal Form */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-card modal-checkout">
            <div className="modal-header-flex">
              <h2>⚡ Complete Your Order</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowCheckoutModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, name: e.target.value })
                    }
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                    }
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, email: e.target.value })
                  }
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.address}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, address: e.target.value })
                  }
                  placeholder="Flat/House No., Street name, Landmark"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.city}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, city: e.target.value })
                    }
                    placeholder="e.g. Mumbai / Bengaluru"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.pincode}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                    }
                    placeholder="e.g. 400001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options-grid">
                  <label className="payment-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={checkoutForm.paymentMethod === "UPI"}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <span>⚡ Instant UPI / QR</span>
                  </label>
                  <label className="payment-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit/Debit Card"
                      checked={checkoutForm.paymentMethod === "Credit/Debit Card"}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <span>💳 Cards & NetBanking</span>
                  </label>
                  <label className="payment-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={checkoutForm.paymentMethod === "Cash on Delivery"}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="checkout-summary-bar">
                <span>Total Amount:</span>
                <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Back to Bag
                </button>
                <button type="submit" className="btn-primary">
                  Place Order Now →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
