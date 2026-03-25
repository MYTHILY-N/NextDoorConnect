import { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const fetchProfile = async () => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 503) {
          throw new Error("Backend server is unavailable. Please check if the server is running and database is connected.");
        }
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setEditFormData({
          fullName: data.user.fullName || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          serviceDomain: data.user.serviceDomain || "",
          hourlyRate: data.user.hourlyRate || "",
          serviceDescription: data.user.serviceDescription || ""
        });
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch profile.");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      const errorMessage = err.name === "AbortError" 
        ? "Request timeout. Server may be down or slow."
        : err.message || "An error occurred while loading your profile";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!editFormData.fullName || !editFormData.phone) {
      alert("Full Name and Phone are required.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error("Backend server is unavailable. Please try again later.");
        }
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        if (editFormData.fullName !== localStorage.getItem("fullName")) {
           localStorage.setItem("fullName", editFormData.fullName);
        }
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg = err.name === "AbortError" 
        ? "Request timeout. Server may be down."
        : err.message || "Error updating profile";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setRetrying(true);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-state error-card">
          <h3>⚠️ Unable to Load Profile</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="retry-btn" 
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? "Retrying..." : "Retry"}
            </button>
            <p className="error-hint">
              💡 Make sure your backend server is running on localhost:5000 and MongoDB is connected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <h3>User not found</h3>
          <p>Unable to retrieve user information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        {isEditing ? (
          <input 
            type="text" 
            name="fullName" 
            className="edit-input title-input" 
            value={editFormData.fullName} 
            onChange={handleEditChange} 
          />
        ) : (
          <h2>{user.fullName}</h2>
        )}
        <span className="role-badge">{user.role?.toUpperCase()}</span>
        
        {!isEditing && (
          <div>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="profile-details-card">
        <h3>Account Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone</span>
            {isEditing ? (
              <input type="text" name="phone" className="edit-input" value={editFormData.phone} onChange={handleEditChange} />
            ) : (
              <span className="detail-value">{user.phone}</span>
            )}
          </div>
          <div className="detail-item full-width">
            <span className="detail-label">Address</span>
            {isEditing ? (
              <textarea name="address" className="edit-textarea" value={editFormData.address} onChange={handleEditChange} />
            ) : (
              <span className="detail-value">{user.address || "Not provided"}</span>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {user.role === "provider" && (
        <div className="profile-details-card mt-24">
          <h3>Professional Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Service Domain</span>
              {isEditing ? (
                <input type="text" name="serviceDomain" className="edit-input" value={editFormData.serviceDomain} onChange={handleEditChange} />
              ) : (
                <span className="detail-value">{user.serviceDomain || "Not set"}</span>
              )}
            </div>
            <div className="detail-item">
              <span className="detail-label">Hourly Rate</span>
              {isEditing ? (
                <input type="text" name="hourlyRate" className="edit-input" value={editFormData.hourlyRate} onChange={handleEditChange} />
              ) : (
                <span className="detail-value">{user.hourlyRate}</span>
              )}
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Description</span>
              {isEditing ? (
                <textarea name="serviceDescription" className="edit-textarea" value={editFormData.serviceDescription} onChange={handleEditChange} />
              ) : (
                <span className="detail-value">{user.serviceDescription || "Not set"}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="action-buttons">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={saving}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
