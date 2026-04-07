import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "../styles/ProductDetail.css";

const CATEGORY_ICONS = {
  "Cars": "🚗", "Bikes": "🏍️", "Properties": "🏠",
  "Electronics & Appliances": "📺", "Mobiles": "📱",
  "Commercial Vehicles & Spares": "🚚", "Jobs": "💼",
  "Furniture": "🪑", "Fashion": "👗", "Pets": "🐕",
  "Books, Sports & Hobbies": "🎸", "Services": "🛠️",
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [imgZoom, setImgZoom] = useState(false);
  const [toast, setToast] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);
      } catch (e) {
        console.error("Error fetching product:", e);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIdx = cart.findIndex((item) => item._id === product._id);
    if (existingIdx > -1) {
      cart[existingIdx].qty = (cart[existingIdx].qty || 1) + quantity;
    } else {
      cart.push({ ...product, qty: quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`✅ "${product.title}" added to cart!`);
  };

  const handleBuyNow = () => {
    localStorage.setItem("buyNowProduct", JSON.stringify({ ...product, qty: quantity }));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-skeleton" />
        <div className="pd-skeleton short" />
        <div className="pd-skeleton" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products")}>← Back to Products</button>
      </div>
    );
  }

  const hasRealImg = product.image &&
    !product.image.includes("via.placeholder.com") &&
    !product.image.includes("placehold.co");

  const images = hasRealImg ? [product.image] : [];

  return (
    <div className="pd-page">
      {/* Toast */}
      {toast && <div className="pd-toast">{toast}</div>}

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <span onClick={() => navigate("/products")} className="pd-crumb-link">Products</span>
        <span className="pd-crumb-sep">›</span>
        {product.category && (
          <><span onClick={() => navigate("/products")} className="pd-crumb-link">{product.category}</span><span className="pd-crumb-sep">›</span></>
        )}
        <span className="pd-crumb-current">{product.title}</span>
      </div>

      <div className="pd-layout">
        {/* ───── LEFT COLUMN ───── */}
        <div className="pd-left">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div
              className={`pd-main-img-wrap ${imgZoom ? "zoomed" : ""}`}
              onMouseEnter={() => setImgZoom(true)}
              onMouseLeave={() => setImgZoom(false)}
            >
              {images.length > 0 ? (
                <img
                  src={images[activeImg]}
                  alt={product.title}
                  className="pd-main-img"
                />
              ) : (
                <div className="pd-img-placeholder">
                  <span className="pd-placeholder-icon">{CATEGORY_ICONS[product.category] || "📦"}</span>
                  <span>{product.category}</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button className="pd-arrow left" onClick={() => setActiveImg((p) => Math.max(0, p - 1))}>‹</button>
                  <button className="pd-arrow right" onClick={() => setActiveImg((p) => Math.min(images.length - 1, p + 1))}>›</button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pd-thumbnails">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="pd-details-section">
            <h1 className="pd-title">{product.title}</h1>
            <div className="pd-price-row">
              <span className="pd-price">₹ {product.price?.toLocaleString()}</span>
              {product.isFeatured && <span className="pd-featured-tag">⭐ Featured</span>}
            </div>

            <div className="pd-info-grid">
              {product.brand && <div className="pd-info-row"><span className="pd-info-label">Brand</span><span className="pd-info-val">{product.brand}</span></div>}
              {product.subcategory && <div className="pd-info-row"><span className="pd-info-label">Category</span><span className="pd-info-val">{product.subcategory}</span></div>}
              {product.year && <div className="pd-info-row"><span className="pd-info-label">Year</span><span className="pd-info-val">{product.year}</span></div>}
              {product.usage && <div className="pd-info-row"><span className="pd-info-label">Usage</span><span className="pd-info-val">{product.usage}</span></div>}
              <div className="pd-info-row"><span className="pd-info-label">Location</span><span className="pd-info-val">📍 {product.location}</span></div>
            </div>

            {product.description && (
              <div className="pd-desc-section">
                <h3 className="pd-section-title">Description</h3>
                <p className="pd-description">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* ───── RIGHT COLUMN ───── */}
        <div className="pd-right">
          {/* Price Card (sticky) */}
          <div className="pd-right-card pd-price-card">
            <div className="pd-price-big">₹ {product.price?.toLocaleString()}</div>
            <div className="pd-location-tag">📍 {product.location}</div>
            <div className="pd-posted-on">Posted on {new Date(product.createdAt).toLocaleDateString()}</div>

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Qty</span>
              <div className="pd-qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <button className="pd-btn-buy" onClick={handleBuyNow}>🛒 Buy Now</button>
            <button className="pd-btn-cart" onClick={handleAddToCart}>♡ Add to Cart</button>
          </div>

          {/* Seller Card */}
          <div className="pd-right-card pd-seller-card">
            <h3 className="pd-section-title">Seller Information</h3>
            <div className="pd-seller-row">
              <div className="pd-seller-avatar">
                {(product.sellerName || "S").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="pd-seller-name">{product.sellerName || product.sellerId?.fullName || "Anonymous"}</div>
                <div className="pd-seller-badge">✔ Verified Seller</div>
              </div>
            </div>
            {product.sellerPhone && (
              <div className="pd-seller-phone">
                📞 <a href={`tel:${product.sellerPhone}`}>{product.sellerPhone}</a>
              </div>
            )}
            <div className="pd-seller-since">Member since {new Date(product.createdAt).getFullYear()}</div>
          </div>

          {/* Safety Tips */}
          <div className="pd-right-card pd-safety-card">
            <h4 className="pd-safety-title">🔒 Safety Tips</h4>
            <ul className="pd-safety-list">
              <li>Meet seller in a safe, public place</li>
              <li>Check the item before paying</li>
              <li>Never pay in advance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
