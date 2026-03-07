import { NavLink, useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <span className="welcome-text">
          Welcome Admin
        </span>
      </div>

      <div className="admin-nav-center">
        <ul className="admin-nav-links">
          <li>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/admin/feedback">Feedback</NavLink>
          </li>
          <li>
            <NavLink to="/admin/complaints">Complaints</NavLink>
          </li>
          <li>
            <NavLink to="/admin/about">About</NavLink>
          </li>
        </ul>
      </div>

      <div className="admin-nav-right">
        <h2 className="admin-nav-title">NextDoor Connect</h2>
        <div className="admin-profile-section">
          <span className="admin-profile-icon">👤 Admin</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
