import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "./About.css";

function AdminAbout() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/user/home");
    }
  }, [navigate]);
  return (
    <>
      <AdminNavbar />
      <div className="about-container">
        <div className="about-inner">
          {/* HERO */}
          <section className="about-hero">
            <h1>📘 About NextDoor Connect - Admin Portal</h1>
            <p className="about-tagline">
              Managing Trust. Ensuring Safety. Supporting Communities.
            </p>
          </section>

          {/* INTRO */}
          <div className="center-content">
            <section className="about-section">
              <h2>🛡️ Admin Panel Overview</h2>
              <p>
                As an administrator of NextDoor Connect, you access a comprehensive dashboard to manage
                all community members, verify identities, monitor feedback, and address complaints.
                Your role ensures the platform maintains the highest standards of trust, safety, and
                community integrity.
              </p>
            </section>

            {/* ADMIN RESPONSIBILITIES */}
            <section className="about-section highlight">
              <h2>🎯 Admin Responsibilities</h2>
              <p>
                Your key duties include:
              </p>
              <ul style={{ textAlign: "left", marginLeft: "40px", lineHeight: "1.8" }}>
                <li><strong>User Verification:</strong> Review and approve user registrations with proper documentation</li>
                <li><strong>Provider Management:</strong> Verify service providers and their credentials</li>
                <li><strong>Community Feedback:</strong> Monitor and analyze feedback to improve platform experience</li>
                <li><strong>Complaint Resolution:</strong> Address community complaints and maintain order</li>
                <li><strong>Data Integrity:</strong> Ensure accurate and secure user information</li>
              </ul>
            </section>
          </div>

          {/* ADMIN FEATURES */}
          <section className="about-grid">
            <div className="about-card">
              <h3>👥 User Management</h3>
              <p>
                View all registered users, verify their documents, check their roles, and maintain
                a comprehensive user database. Make informed decisions about community memberships.
              </p>
            </div>

            <div className="about-card">
              <h3>💬 Feedback Management</h3>
              <p>
                Monitor community feedback, analyze ratings, and understand user satisfaction levels.
                Use insights to improve platform features and address community concerns.
              </p>
            </div>

            <div className="about-card">
              <h3>⚠️ Complaint Resolution</h3>
              <p>
                Track and manage community complaints. Take swift action to resolve issues and maintain
                a safe, respectful environment for all members.
              </p>
            </div>

            <div className="about-card">
              <h3>📊 Analytics & Insights</h3>
              <p>
                Access detailed dashboard statistics showing user distribution, verification status,
                and community engagement metrics to guide administrative decisions.
              </p>
            </div>

            <div className="about-card">
              <h3>🔐 Security & Compliance</h3>
              <p>
                Maintain platform security standards, verify user documents, and ensure all
                community members comply with platform guidelines and regulations.
              </p>
            </div>

            <div className="about-card">
              <h3>🌐 Community Support</h3>
              <p>
                Serve as the primary point of contact for community concerns. Foster a safe,
                inclusive environment where all members feel protected and valued.
              </p>
            </div>
          </section>

          {/* PRINCIPLES */}
          <section className="about-section">
            <h2>🤝 Admin Principles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h4>✓ Integrity</h4>
                <p>Make fair, unbiased decisions based on facts and platform guidelines.</p>
              </div>
              <div>
                <h4>✓ Transparency</h4>
                <p>Communicate clearly about decisions and actions taken for the community.</p>
              </div>
              <div>
                <h4>✓ Efficiency</h4>
                <p>Process verifications and complaints promptly to keep the platform running smoothly.</p>
              </div>
              <div>
                <h4>✓ Community Focus</h4>
                <p>Always prioritize community welfare and platform stability.</p>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="about-section highlight">
            <h2>📧 Need Assistance?</h2>
            <p>
              For admin support or technical issues, please contact the system administrator
              or review the admin documentation in the help section.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default AdminAbout;
