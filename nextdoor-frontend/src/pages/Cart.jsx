import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../api";
import "../styles/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/cart`);
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/cart/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (loading) return <div className="cart-page"><div className="cart-empty"><h2>Loading Cart...</h2></div></div>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Seems like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="shop-now-btn">Explore Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <img 
                  src={item.product?.image || "https://via.placeholder.com/150"} 
                  alt={item.product?.title} 
                  className="cart-item-img" 
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.product?.title}</h3>
                  <div className="cart-item-price">₹ {item.product?.price?.toLocaleString()}</div>
                  <div className="cart-qty-control">
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="cart-item-actions">
                    <button className="remove-btn" onClick={() => handleRemove(item.product?._id)}>🗑 Remove</button>
                    <button className="checkout-btn" style={{padding: '10px 20px', marginTop: 0}} onClick={() => {
                        localStorage.setItem("buyNowProduct", JSON.stringify({...item.product, qty: item.quantity}));
                        navigate("/checkout");
                    }}>Buy Now</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <h3 className="summary-title">Summary</h3>
            <div className="summary-row">
              <span>Items ({cartItems.length})</span>
              <span>₹ {totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{color: '#00bdb3'}}>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹ {totalPrice.toLocaleString()}</span>
            </div>
            <p style={{fontSize: '0.85rem', color: '#888', marginTop: 10}}>Click 'Buy Now' on an item to proceed to checkout.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
