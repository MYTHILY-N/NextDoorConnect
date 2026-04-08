import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "./ProductCard.css";

const CATEGORY_ICONS = {
  "Cars": "🚗", "Bikes": "🏍️", "Properties": "🏠",
  "Electronics & Appliances": "📺", "Mobiles": "📱",
  "Commercial Vehicles & Spares": "🚚", "Jobs": "💼",
  "Furniture": "🪑", "Fashion": "👗", "Pets": "🐕",
  "Books, Sports & Hobbies": "🎸", "Services": "🛠️",
};

const ProductCard = ({ product }) => {
    const [imgError, setImgError] = useState(false);
    const hasValidImage = !!product.image && !imgError;
  const categoryIcon = CATEGORY_ICONS[product.category] || "📦";
  const isSold = product.status === "sold" || product.status === "rented";
  const navigate = useNavigate();

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to add to favorites");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/favorites");
      }
    } catch (err) {
      console.error("Favorite Error:", err);
    }
  };

  return (
    <Link 
      to={isSold ? "#" : `/products/${product._id}`} 
      className={`product-card-link ${isSold ? "sold-link" : ""}`}
      onClick={(e) => isSold && e.preventDefault()}
    >
      <div className={`product-card ${isSold ? "is-sold" : ""}`}>
        <div className="product-image-container">
          {isSold && (
            <div className="sold-overlay">
              <span className="sold-badge">
                {product.status === "sold" ? "SOLD" : "RENTED"}
              </span>
            </div>
          )}
          {hasValidImage ? (
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="product-image-placeholder">
              <span className="placeholder-icon">{categoryIcon}</span>
              <span className="placeholder-label">{product.category || "Product"}</span>
            </div>
          )}
          {product.isFeatured && <span className="featured-badge">FEATURED</span>}
          {product.type === "rent" && <span className="featured-badge" style={{top: '45px', background: '#fff', color: '#00bdb3', border: '1px solid #00bdb3'}}>FOR RENT</span>}
          <button 
            className="wishlist-btn" 
            onClick={handleFavorite}
          >
            ❤️
          </button>
        </div>
        
        <div className="product-content">
          <h2 className="product-price">
            ₹ {product.price?.toLocaleString()}
            {product.type === "rent" && <span style={{fontSize: "0.9rem", fontWeight: 500, color: "#666"}}> / day</span>}
          </h2>
          <p className="product-title" title={product.title}>
            {product.title}
          </p>
          
          {(product.brand || product.subcategory) && (
            <div className="product-meta-tags">
              {product.brand && <span className="meta-tag">{product.brand}</span>}
              {product.subcategory && <span className="meta-tag">{product.subcategory}</span>}
            </div>
          )}
          
          <div className="product-details">
            {product.year && <span>{product.year}</span>}
            {product.year && product.usage && <span> • </span>}
            {product.usage && <span>{product.usage}</span>}
          </div>
          
          <div className="product-footer">
            <span className="product-location" title={product.location}>
              📍 {product.location}
            </span>
            <span className="product-time">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
