import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>NextDoor Connect</h1>
        <h3>Built for Neighbors, Powered by Trust!</h3>

        <p>
          NextDoor Connect is a community-oriented digital marketplace designed
          exclusively for your residential neighborhood.
        </p>

        <button
          className="explore-btn"
          onClick={() => navigate("/dashboard")}
        >
          Explore
        </button>
      </div>

      <div className="home-image">
        <img src="/community.png" alt="Community" />
      </div>
    </div>
  );
}

export default Home;
