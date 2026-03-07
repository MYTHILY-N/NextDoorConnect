import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "./Feedback.css";

function Feedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: localStorage.getItem("fullName") || "",
    contact: localStorage.getItem("email") || "",
    message: "",
  });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    // Prevent changes if the field is meant to be read-only (name or contact)
    if (e.target.name === "name" || e.target.name === "contact") return;

    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (rating === 0) newErrors.rating = "Please select a rating";

    const contact = formData.contact.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,}$/; // Simple 10+ digit check

    if (!contact) {
      newErrors.contact = "Email or Phone is required";
    } else if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
      newErrors.contact = "Please enter a valid Email or Phone Number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            rating,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsSubmitted(true);
          // Keep the pre-filled info after submission
          setRating(0);
          setErrors({});
        } else {
          alert(result.message || "Failed to submit feedback");
        }
      } catch (error) {
        console.error("Feedback submission error details:", error);
        alert(`Could not connect to the server (${error.message}). Please ensure the backend is running at ${API_BASE_URL}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStarClick = (index) => {
    setRating(index);
    if (errors.rating) setErrors({ ...errors, rating: "" });
  };

  const readOnlyStyle = {
    backgroundColor: "#f5f5f5",
    cursor: "not-allowed",
    color: "#666"
  };

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <h2>We Value Your Feedback</h2>
        <p className="feedback-subtitle">
          Help us improve NextDoor Connect by sharing your experience.
        </p>

        {isSubmitted ? (
          <div className="success-message">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
            <button onClick={() => setIsSubmitted(false)}>Send Another</button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                readOnly
                style={readOnlyStyle}
                placeholder="Your Name"
                className={errors.name ? "error-input" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contact">Email</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                readOnly
                style={readOnlyStyle}
                placeholder="name@example.com"
                className={errors.contact ? "error-input" : ""}
              />
              {errors.contact && (
                <span className="error-text">{errors.contact}</span>
              )}
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= (hoverRating || rating) ? "active" : ""
                      }`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              {errors.rating && (
                <span className="error-text">{errors.rating}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you think..."
                className={errors.message ? "error-input" : ""}
              ></textarea>
              {errors.message && (
                <span className="error-text">{errors.message}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Feedback"}
            </button>

            <button
              type="button"
              className="submit-btn"
              style={{ background: "#f44336", marginTop: "15px" }}
              onClick={() => navigate("/complaint")}
            >
              File a Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Feedback;
