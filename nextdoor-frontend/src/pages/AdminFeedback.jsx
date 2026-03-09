import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import API_BASE_URL from "../api";
import "./AdminFeedback.css";

function AdminFeedback() {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/user/home");
            return;
        }
        fetchFeedbacks();
    }, [navigate]);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/feedback/all`);
            const data = await res.json(); // Parse the JSON response
            if (Array.isArray(data)) {
                setFeedbacks(data);
            } else {
                console.error("Feedbacks data is not an array:", data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setLoading(false);
        }
    };

    const calculateOverallRating = () => {
        if (feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
        return (sum / feedbacks.length).toFixed(1);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return { bg: "#f0fdf4", text: "#16a34a" }; // Green
        if (rating >= 3) return { bg: "#fffbeb", text: "#d97706" }; // Amber
        return { bg: "#fef2f2", text: "#dc2626" }; // Red
    };

    if (loading) return (
        <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#00bdb3' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #00bdb3', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginRight: '15px' }}></div>
            Loading Feedbacks...
        </div>
    );

    return (
        <>
            <AdminNavbar />
            <div className="dashboard-container admin-feedback-page">
                <div className="feedback-header-section">
                    <h1 className="dashboard-title">📢 Community Feedback</h1>

                    {/* OVERALL RATING MINI CARD */}
                    <div className="feedback-overall-card">
                        <div className="rating-value">
                            {calculateOverallRating()}★
                        </div>
                        <div className="rating-details">
                            <div style={{ fontSize: "12px", opacity: 0.9 }}>Avg Rating</div>
                            <div style={{ fontSize: "14px", fontWeight: "600" }}>{feedbacks.length} Total Reviews</div>
                        </div>
                    </div>
                </div>

                <div className="feedback-table-container">
                    <table className="feedback-table">
                        <thead>
                            <tr>
                                <th>Customer Info</th>
                                <th>Feedback Message</th>
                                <th>Rating</th>
                                <th>Submitted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((f) => {
                                const colors = getRatingColor(f.rating);
                                return (
                                    <tr key={f._id}>
                                        <td>
                                            <div className="customer-info">
                                                <span className="customer-name">{f.name}</span>
                                                <span className="customer-contact">{f.contact}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="feedback-msg">"{f.message}"</p>
                                        </td>
                                        <td>
                                            <span className="rating-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                                                ⭐ {f.rating}.0
                                            </span>
                                        </td>
                                        <td>
                                            <span className="date-text">{new Date(f.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {feedbacks.length === 0 && (
                        <div className="no-data">
                            <span className="no-data-icon">📭</span>
                            <p>No feedback submitted yet. Your community is quiet!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminFeedback;
