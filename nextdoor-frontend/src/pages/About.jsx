import "./About.css";

function About() {
  return (

    <div className="about-container">
      <div className="about-inner">

        {/* HERO */}
        <section className="about-hero">
          <h1>📘 About NextDoor Connect</h1>
          <p className="about-tagline">
            Connecting Neighbors. Building Trust. Strengthening Communities.
          </p>
        </section>

        {/* INTRO */}
        <div className="center-content">
          <section className="about-section">
            <p>
              NextDoor Connect is a community-oriented digital platform designed to
              bring residents of a neighborhood closer through trusted digital
              interactions. Verified residents can offer and request services,
              rent or share rarely used items, and buy or sell products within
              their own residential community. Unlike large city-wide service platforms, NextDoor Connect focuses
              on local trust, safety, and sustainability — ensuring that every
              interaction happens within a verified and controlled environment.
            </p>




          </section>

          {/* VISION */}
          <section className="about-section highlight">
            <h2>🎯 Our Vision</h2>
            <p>
              To create a digitally empowered neighborhood where residents can
              support one another, share resources, and grow together through a
              secure and transparent platform.
            </p>
          </section>
        </div>

        {/* PROBLEM + SOLUTION */}
        <section className="about-grid">
          <div className="about-card">
            <h3>🧩 The Problem We Address</h3>
            <ul>
              <li>Lack of community-level trust</li>
              <li>Unknown and unreliable service providers</li>
              <li>Overconsumption and waste</li>
              <li>Hidden local skills within neighborhoods</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>💡 Our Solution</h3>
            <ul>
              <li>Verified resident-only access</li>
              <li>Community-based service discovery</li>
              <li>Local skill sharing & micro-entrepreneurship</li>
              <li>Admin-controlled verification system</li>
            </ul>
          </div>
        </section>

        {/* TRUST */}
        <section className="about-section trust">
          <h2>🔐 Trust & Security First</h2>
          <p>
            All users and service providers are verified by the community admin.
            Role-based access, secure authentication, monitored activities, and
            transparent ratings ensure a safe and reliable ecosystem.
          </p>
        </section>

        {/* IMPACT */}
        <section className="about-section">
          <h2>🌱 Sustainability & Community Impact</h2>
          <p>
            By promoting item sharing, local services, and reuse, NextDoor
            Connect helps reduce unnecessary purchases, lower environmental
            impact, strengthen neighborhood relationships, and keep economic
            value within the community.
          </p>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          <h2>🛠 Key Features at a Glance</h2>

          <div className="features-grid">
            <div className="feature-card">🏘 Community-based marketplace</div>
            <div className="feature-card">🛒 Buy, sell & rent locally</div>
            <div className="feature-card">🤖 AI-assisted chatbot support</div>
            <div className="feature-card">🛡 Admin verification system</div>
            <div className="feature-card">⭐ Ratings & feedback</div>
          </div>
        </section>

        {/* DEVELOPER CONTACT - ADMIN ONLY */}
        {localStorage.getItem("role") === "admin" && (
          <section className="about-section highlight developer-contact">
            <h2>👨‍💻 Developer Contact</h2>
            <div style={{ padding: "10px", color: "#444" }}>
              <p><strong>Name:</strong> Mythily (Lead Developer)</p>
              <p><strong>Email:</strong> mythily@nextdoor-connect.com</p>
              <p><strong>Support:</strong> +1 (555) 000-0000</p>
              <p style={{ marginTop: "10px", fontSize: "14px", fontStyle: "italic" }}>
                This section is only visible to administrators.
              </p>
            </div>
          </section>
        )}

        {/* FOOT NOTE */}
        <section className="about-footer">
          <p>
            🤝 <strong>NextDoor Connect</strong> is not just a platform — it’s a
            digital extension of your neighborhood.
          </p>
        </section>

      </div>
    </div>
  );
}

export default About;
