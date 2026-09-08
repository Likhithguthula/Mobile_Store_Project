import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext();

const CART_STORAGE_KEY = "electromob_cart_items";

export function CartProvider({ children }) {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState({ code: "", discountPercent: 0, flatDiscount: 0 });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (mobile, quantity = 1, color = null) => {
    const chosenColor = color || (mobile.colors && mobile.colors[0]) || "Standard";
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === mobile.id && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        addToast(`Updated ${mobile.name} quantity in cart`, "info");
        return updated;
      } else {
        addToast(`Added ${mobile.name} to cart!`, "success");
        return [
          ...prevItems,
          {
            id: mobile.id,
            name: mobile.name,
            brand: mobile.brand,
            price: Number(mobile.price),
            originalPrice: Number(mobile.originalPrice || mobile.price),
            image: mobile.image,
            storage: mobile.storage,
            ram: mobile.ram,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (id, selectedColor) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && (!selectedColor || item.selectedColor === selectedColor))
      )
    );
    addToast("Item removed from cart", "info");
  };

  const updateQuantity = (id, quantity, selectedColor) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedColor);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && (!selectedColor || item.selectedColor === selectedColor)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon({ code: "", discountPercent: 0, flatDiscount: 0 });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SAVE10") {
      setCoupon({ code: "SAVE10", discountPercent: 10, flatDiscount: 0 });
      addToast("Coupon SAVE10 applied: 10% OFF!", "success");
      return { success: true, message: "10% discount applied" };
    } else if (clean === "ELECTRO5000") {
      setCoupon({ code: "ELECTRO5000", discountPercent: 0, flatDiscount: 5000 });
      addToast("Coupon ELECTRO5000 applied: ₹5,000 OFF!", "success");
      return { success: true, message: "₹5,000 flat discount applied" };
    } else {
      addToast("Invalid coupon code. Try SAVE10 or ELECTRO5000", "error");
      return { success: false, message: "Invalid coupon" };
    }
  };

  const removeCoupon = () => {
    setCoupon({ code: "", discountPercent: 0, flatDiscount: 0 });
    addToast("Coupon removed", "info");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (coupon.discountPercent > 0) {
    discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
  } else if (coupon.flatDiscount > 0) {
    discountAmount = Math.min(coupon.flatDiscount, subtotal);
  }

  const tax = Math.round((subtotal - discountAmount) * 0.18); // 18% GST standard
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 499;
  const grandTotal = Math.max(0, subtotal - discountAmount + tax + shipping);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        totalItems,
        subtotal,
        discountAmount,
        tax,
        shipping,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
