import { useState, useEffect } from "react";
import "./MyBookingRequests.css";

function MyBookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setError("User ID not found in local storage.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setBookings(data.bookings);
        } else {
          setError(data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "status-pending";
      case "Accepted": return "status-accepted";
      case "In Progress": return "status-inprogress";
      case "Completed": return "status-completed";
      case "Rejected": return "status-rejected";
      default: return "";
    }
  };

  if (loading) return <div className="loading-state">Loading bookings...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="bookings-container">
      <h1 className="page-title">My Booking Requests</h1>
      
      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You have no booking requests yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.serviceCategory}</h3>
                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-body">
                <p><strong>Provider:</strong> {booking.providerId?.fullName || "Unknown"}</p>
                <p><strong>Date Requested:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {booking.userAddress}</p>
                {booking.description && (
                  <p><strong>Description:</strong> {booking.description}</p>
                )}
                <p><strong>Payment:</strong> {booking.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingRequests;
