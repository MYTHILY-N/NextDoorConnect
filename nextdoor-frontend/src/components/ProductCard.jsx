import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const hasValidImage = product.image && !imgError && !product.image.includes("via.placeholder.com") && !product.image.includes("placehold.co");
  const categoryIcon = CATEGORY_ICONS[product.category] || "📦";

  return (
    <Link to={`/products/${product._id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
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
          <button 
            className="wishlist-btn" 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            ❤️
          </button>
        </div>
        
        <div className="product-content">
          <h2 className="product-price">₹ {product.price?.toLocaleString()}</h2>
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
