import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../api";
import ProductCard from "../components/ProductCard";
import "../styles/Favorites.css";

function Favorites() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/favorites`);
      const data = await res.json();
      if (data.success) {
        setFavs(data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
    setLoading(false);
  };

  if (loading) return <div className="fav-page"><div className="fav-empty"><h2>Loading Favorites...</h2></div></div>;

  return (
    <div className="fav-page">
      <h1 className="fav-title">❤️ Your Favorites</h1>

      {favs.length === 0 ? (
        <div className="fav-empty">
          <h2>Your favorites list is empty</h2>
          <p>Tap the heart icon on any product to save it here.</p>
          <Link to="/products" className="fav-explore-btn">Go Explore</Link>
        </div>
      ) : (
        <div className="fav-grid">
          {favs.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
