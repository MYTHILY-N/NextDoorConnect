import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import "../styles/OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <div className="oh-loading">Loading your order history...</div>;

  return (
    <div className="oh-page">
      <div className="oh-container">
        <h1 className="oh-title">My Order History</h1>
        <p className="oh-subtitle">View and track all your past marketplace purchases.</p>

        {orders.length === 0 ? (
          <div className="oh-empty">
            <div className="oh-empty-icon">🛍️</div>
            <h3>No orders yet!</h3>
            <p>Looks like you haven't bought anything from the marketplace yet.</p>
            <button className="oh-btn-shop" onClick={() => window.location.href = "/products"}>Start Shopping</button>
          </div>
        ) : (
          <div className="oh-list">
            {orders.map((order) => (
              <div key={order._id} className="oh-card">
                <div className="oh-card-header">
                  <span className="oh-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className={`oh-status ${order.status}`}>{order.status.toUpperCase()}</span>
                </div>
                <div className="oh-card-body">
                  <div className="oh-prod-img">
                    {order.product?.image ? (
                      <img src={order.product.image} alt={order.product.title} />
                    ) : (
                      <div className="oh-img-placeholder">📦</div>
                    )}
                  </div>
                  <div className="oh-prod-info">
                    <h3 className="oh-prod-title">{order.product?.title || "Product Deleted"}</h3>
                    <p className="oh-prod-price">₹ {order.amount?.toLocaleString()}</p>
                    <p className="oh-pay-method">Paid via: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                  </div>
                </div>
                <div className="oh-card-footer">
                  <div className="oh-delivery-info">
                    <strong>Delivering to:</strong> {order.deliveryDetails?.fullName}, {order.deliveryDetails?.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
