import { useEffect, useState } from "react";
import "../styles/ProviderDashboard.css";

function ProviderDashboard() {
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const savedName = localStorage.getItem("fullName");
    if (savedName) setFullName(savedName);
  }, []);

  return (
    <div className="provider-dashboard">
      <div className="provider-welcome">
        <h1>Welcome Back, {fullName}! 👋</h1>
        <p>Your neighborhood is looking for your expertise. Here's your business snapshot.</p>
      </div>

      <div className="provider-stats">
        <div className="stat-card">
          <h3>💼 Active Jobs</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>📩 New Requests</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>⭐ Your Rating</h3>
          <div className="stat-number">5.0</div>
        </div>
        <div className="stat-card">
          <h3>💰 Earnings (This Month)</h3>
          <div className="stat-number">₹0</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2 className="section-title"><span>📅</span> Recent Service Requests</h2>
          <div className="requests-list">
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📨</div>
              <p>No new requests at the moment. Stay tuned!</p>
            </div>
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-title"><span>⚡</span> Quick Actions</h2>
          <div className="action-links">
            <button className="action-btn">
              <span>🔧</span> Manage My Services
            </button>
            <button className="action-btn">
              <span>📊</span> View Earnings Report
            </button>
            <button className="action-btn">
              <span>💬</span> Chat with Customers
            </button>
            <button className="action-btn">
              <span>⚙️</span> Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
