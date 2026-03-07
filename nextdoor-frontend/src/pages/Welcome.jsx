import "../styles/Welcome.css";
import welcomeImage from "../assets/welcome-image.png";
import { useNavigate } from "react-router-dom";




function Welcome() {
  const navigate = useNavigate();
  const fullName = typeof window !== 'undefined' ? localStorage.getItem("fullName") : null;

  return (
    <div className="welcome-container">


      {/* LOGIN BUTTON */}
      <button className="login-btn" onClick={() => navigate("/login")}>Login</button>

      <div className="welcome-content">

        {/* LEFT SIDE CONTENT */}
        <div className="welcome-text">
          <h1>{fullName ? `Welcome, ${fullName}!` : "Welcome to NextDoor Connect..."}</h1>

          <h3>
            A Community-oriented Digital Marketplace <br />
            for Service & Resource Sharing
          </h3>

          <p>
            NextDoor Connect is a community-focused digital platform that helps
            neighbors connect through trusted local services and a secure
            neighborhood marketplace. It enables verified residents to offer
            and access services, share or rent resources, and buy or sell items
            within their community, ensuring safety, transparency, and
            convenience. By promoting local collaboration and trust, NextDoor
            Connect strengthens neighborhood relationships and makes everyday
            needs easier to fulfill.
          </p>

          <button className="register-btn" onClick={() => navigate("/register")}>
  Register
</button>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="welcome-image">
          <img src={welcomeImage} alt="Community" />
        </div>

      </div>
    </div>
  );
}

export default Welcome;
