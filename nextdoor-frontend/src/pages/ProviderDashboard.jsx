import { useEffect, useState } from "react";
import "../styles/ProviderDashboard.css";

function ProviderDashboard() {
  const [fullName, setFullName] = useState("User");
  const [providerData, setProviderData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeModal, setActiveModal] = useState(null); // 'analytics', 'profile', 'support', 'reviews'
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleteStep, setDeleteStep] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("fullName");
    if (savedName) setFullName(savedName);

    fetchProviderData();
    fetchBookings();
    fetchReviews();
  }, []);

  const fetchProviderData = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      if (data.success) {
        setProviderData(data.user);
        setEditForm(data.user);
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
    }
  };

  const fetchBookings = async () => {
    const providerId = localStorage.getItem("userId");
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/provider/${providerId}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    const providerId = localStorage.getItem("userId");
    setLoadingReviews(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${providerId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setLoadingReviews(false);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        if (selectedBooking) setSelectedBooking(data.booking);
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === "all") return true;
    return b.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const calculateAggregateRating = () => {
    if (reviews.length === 0) return providerData?.rating || "5.0";
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculateAcceptanceRate = () => {
    const relevantBookings = bookings.filter(b => b.status !== "Rejected");
    if (relevantBookings.length === 0) return 100;
    const successful = bookings.filter(b => ["Accepted", "Completed"].includes(b.status)).length;
    return ((successful / relevantBookings.length) * 100).toFixed(0);
  };

  const getPerformanceTag = () => {
    const rate = parseInt(calculateAcceptanceRate());
    if (rate >= 90) return { speed: "Exceptional / Fast", color: "#059669" };
    if (rate >= 80) return { speed: "Good Work / Speedy", color: "#10b981" };
    if (rate >= 60) return { speed: "Average / Steady", color: "#f59e0b" };
    return { speed: "Slow / Needs Focus", color: "#ef4444" };
  };

  const goldCoins = bookings.filter(b => b.status === "Completed").length * 10;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setProviderData(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        window.location.href = "/"; // Redirect to welcome/login page
      }
    } catch (error) {
      alert("Error deleting account");
    }
  };

  return (
    <div className="provider-dashboard">
      <div className="provider-welcome">
        <h1>Welcome Back, {fullName}! 👋</h1>
        <p>Your neighborhood is looking for your expertise. Here's what's happening today.</p>
      </div>

      <div className="provider-stats">
        {/* <div className="stat-card">
          <h3>💼 Active Jobs</h3>
          <div className="stat-number">{bookings.filter(b => b.status === "Accepted").length}</div>
          <div className="stat-trend">Ongoing projects</div>
        </div> */}
        <div className="stat-card">
          <h3>📩 New Requests</h3>
          <div className="stat-number">{bookings.filter(b => b.status === "Pending").length}</div>
          <div className="stat-trend">Waiting for response</div>
        </div>
        <div className="stat-card rating-card">
          <h3>⭐ Your Rating</h3>
          <div className="stat-flex">
            <div className="stat-number">{calculateAggregateRating()}</div>
            <button className="view-reviews-link" onClick={() => setActiveModal('reviews')}>
              View {reviews.length} Feedback
            </button>
          </div>
          <div className="stat-trend" style={{ color: '#fbbf24' }}>Neighborhood Reputation</div>
        </div>
        <div className="stat-card">
          <h3>💰 Completed Tasks</h3>
          <div className="stat-number">{bookings.filter(b => b.status === "Completed").length}</div>
          <div className="stat-trend">Total success</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card full-width">
          <div className="section-header-flex">
            <h2 className="section-title"><span>📅</span> {activeFilter === "all" ? "All" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} User Requests</h2>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-tab ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`filter-tab ${activeFilter === "accepted" ? "active" : ""}`}
                onClick={() => setActiveFilter("accepted")}
              >
                Accepted
              </button>
            </div>
          </div>

          <div className="requests-container">
            {loading ? (
              <p>Loading requests...</p>
            ) : filteredBookings.length > 0 ? (
              <div className="table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Contact Number</th>
                      <th>Emergency</th>
                      <th>Status</th>
                      <th>Paid Online</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="animate-fade-in">
                        <td className="user-name-cell">
                          <div className="name-avatar">{booking.userName.charAt(0)}</div>
                          {booking.userName}
                        </td>
                        <td>{booking.userPhone}</td>
                        <td>
                          <span className={`badge-emergency ${booking.isEmergency ? 'yes' : 'no'}`}>
                            {booking.isEmergency ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-status ${booking.paidOnline ? 'paid' : 'unpaid'}`}>
                            {booking.paidOnline ? '✅ Yes' : '❌ No'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="view-details-btn"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View More
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📨</div>
                <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '18px', marginBottom: '8px' }}>
                  No {activeFilter !== "all" ? activeFilter : ""} requests found
                </p>
                <p style={{ color: '#64748b' }}>Check your other filters or wait for new neighborhood notifications.</p>
              </div>
            )}
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-title"><span>⚡</span> Pro Hub Actions</h2>
          <div className="action-links">
            <button className="action-btn" onClick={() => setActiveModal('analytics')}>
              <span>📊</span> Performance & Rewards
            </button>
            <button className="action-btn" onClick={() => setActiveModal('profile')}>
              <span>👤</span> My Professional Profile
            </button>
            <button className="action-btn" onClick={() => setActiveModal('support')}>
              <span>🛡️</span> Safety & Support
            </button>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBooking(null)}>×</button>

            <div className="modal-header">
              <h2>Booking Request Details</h2>
              <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>
                {selectedBooking.status}
              </span>
            </div>

            {/* Emergency Banner */}
            {selectedBooking.isEmergency && (
              <div className="emergency-banner">
                🚨 <strong>EMERGENCY REQUEST</strong> — Customer needs immediate assistance!
              </div>
            )}

            {/* Status Stepper */}
            <div className="status-stepper">
              {["Pending", "Accepted", "Completed"].map((step, idx) => {
                const isRejected = selectedBooking.status === "Rejected";
                const steps = ["Pending", "Accepted", "Completed"];
                const currentIdx = steps.indexOf(selectedBooking.status);
                const isActive = step === selectedBooking.status;
                const isDone = !isRejected && currentIdx > idx;
                return (
                  <div key={step} className={`step-item ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                    <div className="step-dot">{isDone ? "✓" : idx + 1}</div>
                    <span>{step}</span>
                  </div>
                );
              })}
              {selectedBooking.status === "Rejected" && (
                <div className="step-item active rejected-step">
                  <div className="step-dot">✕</div>
                  <span>Rejected</span>
                </div>
              )}
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <label>Customer Name</label>
                <p>{selectedBooking.userName}</p>
              </div>
              <div className="detail-group">
                <label>Contact Phone</label>
                <p>{selectedBooking.userPhone}</p>
              </div>
              <div className="detail-group full">
                <label>Service Address</label>
                <p className="address-box">{selectedBooking.userAddress}</p>
              </div>
              <div className="detail-group">
                <label>Service Type</label>
                <p>{selectedBooking.serviceCategory}</p>
              </div>
              <div className="detail-group">
                <label>Payment Mode</label>
                <p>{selectedBooking.paymentMethod?.toUpperCase()} {selectedBooking.paidOnline ? '(Paid ✅)' : '(Cash on Delivery)'}</p>
              </div>
              <div className="detail-group full">
                <label>Additional Description</label>
                <p className="description-box">{selectedBooking.description || "No specific details provided."}</p>
              </div>
            </div>

            {/* Action Section */}
            <div className="modal-manage-section">
              <h4 className="manage-label">📋 Manage This Request</h4>
              <div className="modal-actions">
                {selectedBooking.status === "Pending" && (
                  <>
                    <button
                      className="btn-modal-accept"
                      onClick={() => handleStatusUpdate(selectedBooking._id, "Accepted")}
                    >
                      ✓ Accept Request
                    </button>
                    <button
                      className="btn-modal-reject"
                      onClick={() => handleStatusUpdate(selectedBooking._id, "Rejected")}
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                {selectedBooking.status === "Accepted" && (
                  <>
                    <button
                      className="btn-modal-complete"
                      onClick={() => handleStatusUpdate(selectedBooking._id, "Completed")}
                    >
                      ✔ Mark as Completed
                    </button>
                    <button
                      className="btn-modal-undo"
                      onClick={() => handleStatusUpdate(selectedBooking._id, "Rejected")}
                    >
                      ↩ Change to Rejected
                    </button>
                  </>
                )}

                {selectedBooking.status === "Rejected" && (
                  <>
                    <div className="status-final rejected" style={{ marginBottom: '12px' }}>
                      ❌ Currently Rejected — You can reverse this decision below.
                    </div>
                    <button
                      className="btn-modal-accept"
                      onClick={() => handleStatusUpdate(selectedBooking._id, "Accepted")}
                    >
                      ↩ Revert to Accepted
                    </button>
                  </>
                )}

                {selectedBooking.status === "Completed" && (
                  <div className="status-final success">
                    ✅ This service has been completed successfully. No further changes allowed.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {activeModal === 'analytics' && (
        <div className="booking-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="booking-modal analytics-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveModal(null)}>×</button>
            <div className="modal-header">
              <h2>Performance & Rewards</h2>
            </div>
            <div className="analytics-grid">
              <div className="revenue-card gold-card">
                <label>Gold Coins Earned</label>
                <div className="coin-flex">
                  <span className="coin-icon">🟡</span>
                  <h3>{goldCoins} Coins</h3>
                </div>
                <p>10 coins per completion</p>
              </div>
              <div className="revenue-card highlight">
                <label>Overall Acceptance</label>
                <h3>{calculateAcceptanceRate()}%</h3>
                <p>Neighborhood trust factor</p>
              </div>
            </div>
            <div className="performance-stats">
              <div className="perf-item">
                <span>Performance Ranking</span>
                <strong style={{ color: getPerformanceTag().color }}>{getPerformanceTag().speed}</strong>
              </div>
              <div className="perf-item">
                <span>Neighbor Loyalty</span>
                <strong>High</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Preview Modal */}
      {activeModal === 'profile' && providerData && (
        <div className="booking-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="booking-modal analytics-modal profile-expanded" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setActiveModal(null); setIsEditing(false); setDeleteStep(false); }}>×</button>
            <div className="modal-header">
              <h2>{isEditing ? "Edit Professional Profile" : "Professional Details"}</h2>
            </div>

            {!isEditing ? (
              <div className="profile-preview-content">
                <div className="preview-header">
                  <div className="preview-avatar">{providerData.fullName.charAt(0)}</div>
                  <div className="preview-info">
                    <h3>{providerData.fullName}</h3>
                    <p>{providerData.email}</p>
                  </div>
                </div>
                <div className="preview-details-grid expanded-grid">
                  <div className="prev-group">
                    <label>Service Category</label>
                    <p>{providerData.serviceDomain?.toUpperCase() || "General Professional"}</p>
                  </div>
                  <div className="prev-group">
                    <label>Hourly Rate</label>
                    <p>{providerData.hourlyRate}</p>
                  </div>
                  <div className="prev-group">
                    <label>Availability</label>
                    <p>{providerData.availableTime}</p>
                  </div>
                  <div className="prev-group">
                    <label>Phone Number</label>
                    <p>{providerData.phone}</p>
                  </div>
                  <div className="prev-group full">
                    <label>Description</label>
                    <p className="description-box">{providerData.serviceDescription || "Best-in-class neighborhood service provider."}</p>
                  </div>
                  <div className="prev-group full">
                    <label>Address</label>
                    <p className="description-box">{providerData.address}</p>
                  </div>
                  <div className="prev-group">
                    <label>Account Status</label>
                    <p className="role-tag">{providerData.isVerified ? "Verified Professional" : "Verification Pending"}</p>
                  </div>
                </div>

                <div className="profile-actions-flex">
                  <button className="btn-edit-inline" onClick={() => setIsEditing(true)}>Edit Details</button>
                  <button
                    className="btn-delete-account"
                    onClick={() => setDeleteStep(true)}
                  >
                    Delete Account
                  </button>
                </div>

                {deleteStep && (
                  <div className="delete-confirmation animate-fade-in">
                    <p>⚠️ <strong>Warning:</strong> This will permanently remove your profile, bookings, and ratings from NextDoor Connect. This action cannot be undone.</p>
                    <div className="confirm-buttons">
                      <button className="btn-confirm-delete" onClick={handleDeleteAccount}>Yes, Delete My Account</button>
                      <button className="btn-cancel-delete" onClick={() => setDeleteStep(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form className="edit-profile-form animate-fade-in" onSubmit={handleUpdateProfile}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Hourly Rate (e.g. ₹500/hr)</label>
                    <input type="text" value={editForm.hourlyRate} onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Working Hours</label>
                    <input type="text" value={editForm.availableTime} onChange={(e) => setEditForm({ ...editForm, availableTime: e.target.value })} required />
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required />
                  </div>
                  <div className="form-group full">
                    <label>Service Description</label>
                    <textarea value={editForm.serviceDescription} onChange={(e) => setEditForm({ ...editForm, serviceDescription: e.target.value })} required />
                  </div>
                </div>
                <div className="form-actions-flex">
                  <button type="submit" className="btn-save-profile">Save Changes</button>
                  <button type="button" className="btn-cancel-edit" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Support Modal */}
      {activeModal === 'support' && (
        <div className="booking-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveModal(null)}>×</button>
            <div className="modal-header">
              <h2>Safety & Support</h2>
            </div>
            <div className="support-content">
              <div className="support-section">
                <h4>🛡️ Community Protection</h4>
                <p>Always verify the customer's identity before starting work. Use our in-app emergency flags to prioritize urgent neighborhood needs.</p>
              </div>
              <div className="support-section">
                <h4>🤝 Service Standards</h4>
                <p>Maintain professionalism. High ratings lead to more visibility in the neighborhood directory.</p>
              </div>
              <div className="support-section">
                <h4>📞 Contact Support</h4>
                <p>Email: support@nextdoorconnect.community<br />Help Desk: 1800-NEXT-DOOR</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {activeModal === 'reviews' && (
        <div className="booking-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="booking-modal analytics-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveModal(null)}>×</button>
            <div className="modal-header">
              <h2>Neighborhood Feedback</h2>
              <div className="header-rating-badge">
                ⭐ {calculateAggregateRating()} <span>({reviews.length} reviews)</span>
              </div>
            </div>
            <div className="reviews-list-container">
              {loadingReviews ? (
                <p>Loading feedback...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="review-card-item animate-fade-in">
                    <div className="review-item-header">
                      <div className="review-user">
                        <div className="user-initial">{review.userName.charAt(0)}</div>
                        <div className="user-meta">
                          <span className="user-name">{review.userName}</span>
                          <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "star active" : "star"}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
                  <p>No neighborhood feedback yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
