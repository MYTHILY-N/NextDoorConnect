import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API_BASE_URL from "../api";
import "./AdminComplaints.css";

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/complaints/all`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setComplaints(data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching complaints:", error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/complaints/status/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchComplaints();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "resolved": return "#16a34a";
            case "rejected": return "#dc2626";
            default: return "#ca8a04";
        }
    };

    const openDetails = (complaint) => {
        setSelectedComplaint(complaint);
    };

    const closeDetails = () => {
        setSelectedComplaint(null);
    };

    if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Complaints...</div>;

    return (
        <>
            <AdminNavbar />
            <div className="complaints-page">
                <div className="complaints-header">
                    <h1 className="complaints-title">User Complaints</h1>
                </div>

                <div className="complaints-table-wrapper">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c._id}>
                                    <td>
                                        <div className="user-cell">
                                            <span className="user-name">{c.fullName}</span>
                                            <div className="user-meta">
                                                <span>📧 {c.email}</span>
                                                <span>•</span>
                                                <span>📱 {c.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="description-cell">
                                        <p className="description-text">{c.description}</p>
                                    </td>
                                    <td>
                                        <span className="status-badge" style={{
                                            background: getStatusColor(c.status) + "15",
                                            color: getStatusColor(c.status),
                                            border: `1px solid ${getStatusColor(c.status)}30`
                                        }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="action-select"
                                            value={c.status}
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                        >
                                            <option value="pending">Mark Pending</option>
                                            <option value="resolved">Mark Resolved</option>
                                            <option value="rejected">Mark Rejected</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="view-details-btn" onClick={() => openDetails(c)} title="View Details">
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {complaints.length === 0 && (
                        <div className="no-complaints">
                            <span className="no-complaints-icon">📁</span>
                            <p>No complaints filed yet. Everything is peaceful!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedComplaint && (
                <div className="modal-overlay" onClick={closeDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Complaint Details</h2>
                            <button className="close-modal" onClick={closeDetails}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-group">
                                <div className="detail-label">Complainant</div>
                                <div className="detail-value" style={{ fontWeight: '700' }}>{selectedComplaint.fullName}</div>
                                <div className="detail-value" style={{ fontSize: '14px', color: '#64748b' }}>{selectedComplaint.email} | {selectedComplaint.phone}</div>
                            </div>

                            <div className="detail-group">
                                <div className="detail-label">Description</div>
                                <div className="detail-value">{selectedComplaint.description}</div>
                            </div>

                            <div className="detail-group">
                                <div className="detail-label">Attachment</div>
                                {selectedComplaint.attachment ? (
                                    <a
                                        href={`http://localhost:5000/${selectedComplaint.attachment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-preview"
                                    >
                                        📎 View Attached Document
                                    </a>
                                ) : (
                                    <div className="detail-value" style={{ fontStyle: 'italic', color: '#94a3b8' }}>No attachment provided</div>
                                )}
                            </div>

                            <div className="detail-group">
                                <div className="detail-label">Submission Date</div>
                                <div className="detail-value">
                                    {new Date(selectedComplaint.createdAt).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div className="detail-group" style={{ marginBottom: 0 }}>
                                <div className="detail-label">Latest Status Update</div>
                                <div className="detail-value">
                                    {new Date(selectedComplaint.updatedAt).toLocaleString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminComplaints;
