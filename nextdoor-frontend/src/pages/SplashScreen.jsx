import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SplashScreen.css";
import image from "../assets/splashbg.png";

function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const redirectTimer = setTimeout(() => {
      navigate("/welcome");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>

      {/* LEFT SIDE – CENTERED CONTENT */}
      <div className="left-section">
        <div className="text-box">
          <h1>NEXTDOOR CONNECT</h1>
          <p>Built for Neighbors, Powered by Trust!</p>
        </div>
      </div>

      {/* RIGHT SIDE – FULL IMAGE */}
      <div className="right-section">
        <img src={image} alt="Community" />
      </div>

    </div>
  );
}

export default SplashScreen;
