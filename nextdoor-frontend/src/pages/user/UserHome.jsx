import { useNavigate } from "react-router-dom";
import userWelcomeImg from "../../assets/userwelcomeimg.png";
import "../../styles/UserHome.css";

function UserHome() {
  const navigate = useNavigate();

  return (
    <div className="user-home">
      <div className="user-home-inner">

        {/* HERO SECTION */}
        <div className="home-card">
          <div className="home-content">
            <div className="home-text">
              <h1>NextDoor Connect</h1>
              <h3>Built for Neighbors, Powered by Trust!</h3>

              <p>
                NextDoor Connect is a community-oriented digital marketplace
                designed exclusively for your residential neighborhood.
                Verified residents can offer services, request help, rent items,
                and buy or sell products — all within a trusted environment.
              </p>

              <button
                className="explore-btn"
                onClick={() => navigate("/dashboard")}
              >
                Explore
              </button>
            </div>

            <div className="home-image">
              <img src={userWelcomeImg} alt="Community" />
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <h2>🌟 What You Can Do Here</h2>

          <div className="features-grid">
            <div className="feature-card">
              <span>🔧</span>
              <h4>Find Trusted Services</h4>
              <p>
                Discover verified service providers within your community for
                everyday needs.
              </p>
            </div>

            <div className="feature-card">
              <span>🤝</span>
              <h4>Offer Your Skills or Services</h4>
              <p>
                Become a service provider and help your neighbors while earning
                locally.
              </p>
            </div>

            <div className="feature-card">
              <span>🛒</span>
              <h4>Buy, Sell & Rent Items</h4>
              <p>
                Share rarely used items, reduce waste, and save money within
                your community.
              </p>
            </div>

            <div className="feature-card">
              <span>🏠</span>
              <h4>Community-First Experience</h4>
              <p>
                Interact only with verified residents to ensure safety and trust.
              </p>
            </div>
          </div>

          <div className="trust-box">
            <h3>🔐 Safe. Verified. Reliable.</h3>
            <p>
              Every user and service provider on NextDoor Connect is verified by
              the community admin, ensuring a secure and trustworthy digital
              space.
            </p>
          </div>

          <div className="cta-box">
            <h3>🚀 Get Started</h3>
            <p>
              Explore services, post a request, offer your skills, or browse
              community listings. Your neighborhood support system starts here.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default UserHome;
