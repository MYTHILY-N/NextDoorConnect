import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API_BASE_URL, { BASE_URL } from "../api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/admin/users`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Error fetching users: " + err.message);
      })
      .finally(() => setLoading(false));
  };

  const verifyUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/verify/${id}`, {
        method: "PUT",
      });

      if (res.ok) {
        setUsers(users.map(u =>
          u._id === id ? { ...u, isVerified: true } : u
        ));
        alert("User verified successfully!");
      } else {
        alert("Failed to verify user");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying user");
    }
  };

  const rejectUser = async (id) => {
    const confirmReject = window.confirm("Are you sure you want to reject this user? This action cannot be undone.");
    if (!confirmReject) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/reject/${id}`, {
        method: "PUT",
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        alert("User rejected successfully!");
      } else {
        alert("Failed to reject user");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting user");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Calculate stats
  const totalUsers = users.length;
  const userCount = users.filter(u => u.role === "user").length;
  const providerCount = users.filter(u => u.role === "provider").length;
  const pendingUsers = users.filter(u => !u.isVerified).length;
  const verifiedUsers = users.filter(u => u.isVerified).length;

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        {/* Content */}

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>👤 Total Users</h3>
            <div className="stat-number">{userCount}</div>
          </div>
          <div className="stat-card">
            <h3>🏢 Total Providers</h3>
            <div className="stat-number">{providerCount}</div>
          </div>
          <div className="stat-card">
            <h3>📊 Total Count</h3>
            <div className="stat-number">{totalUsers}</div>
          </div>
          <div className="stat-card">
            <h3>⏳ Pending</h3>
            <div className="stat-number">{pendingUsers}</div>
          </div>
          <div className="stat-card">
            <h3>✓ Verified</h3>
            <div className="stat-number">{verifiedUsers}</div>
          </div>
        </div>

        {/* Content */}
        {loading && <div className="loading-message">⏳ Loading users...</div>}
        {error && <div className="error-message">❌ {error}</div>}
        {!loading && users.length === 0 && !error && <div className="empty-message">No users found</div>}

        {!loading && users.length > 0 && (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Address Proof</th>
                  <th>Service Doc</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td><b>{user.fullName}</b></td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span style={{
                        background: user.role === "provider" ? "#dbeafe" : "#e0e7ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {user.role === "provider" ? "🏢 Provider" : "👤 User"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.isVerified ? "verified" : "pending"}`}>
                        {user.isVerified ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      {user.addressProof ? (
                        <a
                          className="attachment-link"
                          href={`${BASE_URL}/${user.addressProof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 View
                        </a>
                      ) : (
                        <span className="no-attachment">N/A</span>
                      )}
                    </td>
                    <td>
                      {user.serviceDoc ? (
                        <a
                          className="attachment-link"
                          href={`${BASE_URL}/${user.serviceDoc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 View
                        </a>
                      ) : (
                        <span className="no-attachment">N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!user.isVerified && (
                          <>
                            <button
                              className="btn-small btn-verify"
                              onClick={() => verifyUser(user._id)}
                            >
                              ✓ Verify
                            </button>
                            <button
                              className="btn-small btn-reject"
                              onClick={() => rejectUser(user._id)}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        <button
                          className="btn-small btn-view"
                          onClick={() => viewUserDetails(user)}
                        >
                          👁 View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>User Details</h2>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <p><b>Full Name:</b> {selectedUser.fullName}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Phone:</b> {selectedUser.phone}</p>
                <p><b>Role:</b> {selectedUser.role}</p>
                <p><b>Address:</b> {selectedUser.address}</p>
                <p><b>Status:</b> {selectedUser.isVerified ? "Verified ✓" : "Pending ⏳"}</p>
                <p><b>Registered:</b> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
