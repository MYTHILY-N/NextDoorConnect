import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import API_BASE_URL from "../api";

const PRODUCT_CATEGORIES = [
  { name: "Cars", icon: "🚗" },
  { name: "Bikes", icon: "🏍️" },
  { name: "Properties", icon: "🏠" },
  { name: "Electronics & Appliances", icon: "📺" },
  { name: "Mobiles", icon: "📱" },
  { name: "Commercial Vehicles & Spares", icon: "🚚" },
  { name: "Jobs", icon: "💼" },
  { name: "Furniture", icon: "🪑" },
  { name: "Fashion", icon: "👕" },
  { name: "Pets", icon: "🐕" },
  { name: "Books, Sports & Hobbies", icon: "🎸" },
  { name: "Services", icon: "🛠️" }
];


function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("India");

  const fetchProducts = async (category = null, search = "") => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/products?`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery);
  }, []);

  const handleCategoryClick = (categoryName) => {
    const newCat = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCat);
    fetchProducts(newCat, searchQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategory, searchQuery);
  };

  return (
    <div className="products-page">
      {/* Horizontal Toolbar */}
      <div className="marketplace-toolbar">
        <div className="toolbar-left">
          <div className="location-selector">
            <span className="location-icon">📍</span>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="India">India</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>

        <div className="toolbar-center">
          <form className="marketplace-search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Find Cars, Mobile Phones and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        </div>

        <div className="toolbar-right">
          <button className="icon-btn" onClick={()=>navigate("/favorites")} title="Wishlist">❤️</button>
          <button className="icon-btn" onClick={()=>navigate("/cart")} title="Cart">🛒</button>
          <button className="sell-btn" onClick={() => navigate("/post-ad")}>➕ SELL</button>
        </div>
      </div>

      {/* Category Section */}
      <div className="marketplace-categories">
        <ul className="category-list">
          {PRODUCT_CATEGORIES.map((cat, index) => (
            <li 
              key={index} 
              className={`category-item ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="marketplace-content">
        <h2 className="section-heading">
          {selectedCategory ? `Results in ${selectedCategory}` : "Fresh Recommendations"}
        </h2>
        
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : error ? (
          <div className="no-results-state">
            <h3>⚠️ Server Unreachable</h3>
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results-state">
            <h3>No ads posted yet! 🏷️</h3>
            <p>
              {selectedCategory
                ? `No products found in "${selectedCategory}". Try a different category.`
                : "Be the first to post an ad! Click the ➕ SELL button above."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
