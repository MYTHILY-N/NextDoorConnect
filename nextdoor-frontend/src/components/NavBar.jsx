import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/NavBar.css";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fullName =
    typeof window !== "undefined" ? localStorage.getItem("fullName") : null;

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="welcome-text">
          {fullName ? `Welcome, ${fullName}!` : "Welcome, User!"}
        </span>
      </div>

      <div className="nav-center">
        <ul className="nav-links">
          {role === "admin" ? (
            <>
              <li>
                <NavLink to="/admin/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/products">Product</NavLink>
              </li>
              <li>
                <NavLink to="/admin/feedback">Feedback</NavLink>
              </li>
              <li>
                <NavLink to="/admin/complaints">Complaints</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/user/home">Home</NavLink>
              </li>
              <li>
                <NavLink to={role === "provider" ? "/provider/dashboard" : "/dashboard"}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/products">Product</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/help">Help</NavLink>
              </li>
              <li>
                <NavLink to="/feedback">Feedback</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="nav-right">
        <h2 className="nav-title">NextDoor Connect</h2>
        {fullName && (
          <div className="profile-container" ref={dropdownRef}>
            <div 
              className="profile-icon" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>Profile</NavLink>
                <NavLink to="/favorites" onClick={() => setDropdownOpen(false)}>My Favorites</NavLink>
                <NavLink to="/cart" onClick={() => setDropdownOpen(false)}>My Cart</NavLink>
                <NavLink to="/my-booking-requests" onClick={() => setDropdownOpen(false)}>My Booking Requests</NavLink>
                <NavLink to="/order-history" onClick={() => setDropdownOpen(false)}>My Orders</NavLink>
                <NavLink to="/sold-items" onClick={() => setDropdownOpen(false)}>Sold Items History</NavLink>
              </div>
            )}
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
