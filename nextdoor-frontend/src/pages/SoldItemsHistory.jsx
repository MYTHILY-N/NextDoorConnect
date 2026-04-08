import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import "../styles/OrderHistory.css"; // Reuse existing styles for consistency

function SoldItemsHistory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSoldProducts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/products/sold/${userId}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
      setLoading(false);
    };

    fetchSoldProducts();
  }, [userId]);

  if (loading) return <div className="oh-loading">Loading your sold items...</div>;

  return (
    <div className="oh-page">
      <div className="oh-container">
        <h1 className="oh-title">Sold Items History</h1>
        <p className="oh-subtitle">Track the products you have successfully sold on the marketplace.</p>

        {products.length === 0 ? (
          <div className="oh-empty">
            <div className="oh-empty-icon">🏷️</div>
            <h3>No items sold yet!</h3>
            <p>Your sold products will appear here once they are purchased.</p>
            <button className="oh-btn-shop" onClick={() => window.location.href = "/post-ad"}>Post an Ad</button>
          </div>
        ) : (
          <div className="oh-list">
            {products.map((product) => (
              <div key={product._id} className="oh-card">
                <div className="oh-card-header">
                  <span className="oh-date">Sold on {new Date(product.updatedAt).toLocaleDateString()}</span>
                  <span className="oh-status completed">SOLD</span>
                </div>
                <div className="oh-card-body">
                  <div className="oh-prod-img">
                    {product.image ? (
                      <img src={product.image} alt={product.title} />
                    ) : (
                      <div className="oh-img-placeholder">📦</div>
                    )}
                  </div>
                  <div className="oh-prod-info">
                    <h3 className="oh-prod-title">{product.title}</h3>
                    <p className="oh-prod-price">₹ {product.price?.toLocaleString()}</p>
                    <p className="oh-pay-method">Category: {product.category}</p>
                  </div>
                </div>
                <div className="oh-card-footer">
                  <div className="oh-delivery-info">
                    <strong>Location:</strong> {product.location}
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

export default SoldItemsHistory;
