import { NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

function Navbar() {
  const navigate = useNavigate();
  const fullName =
    typeof window !== "undefined" ? localStorage.getItem("fullName") : null;

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

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
        <div className="profile-icon">👤</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
