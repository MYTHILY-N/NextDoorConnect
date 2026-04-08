import { useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import ChatbotWidget from "../components/ChatbotWidget";
import API_BASE_URL, { BASE_URL } from "../api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Booking Flow States
  const [bookingStep, setBookingStep] = useState(null); // 'address', 'payment', 'success'
  const [bookingAddress, setBookingAddress] = useState(localStorage.getItem("address") || "");
  const [bookingPhone, setBookingPhone] = useState(localStorage.getItem("phone") || "");
  const [bookingDescription, setBookingDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingAmount, setBookingAmount] = useState(""); // User entered amount
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const categories = [
    { title: "🔧 Plumbing", description: "Fix leaks, pipes, and drains", slug: "plumbing" },
    { title: "⚡ Electrical", description: "Wiring, repairs, and installations", slug: "electrical" },
    { title: "🧹 Cleaning", description: "House, office, and deep cleaning", slug: "cleaning" },
    { title: "🎨 Painting", description: "Interior and exterior painting", slug: "painting" },
    { title: "🪵 Carpentry", description: "Furniture repair and custom wood", slug: "carpentry" },
    { title: "🔌 Appliances Repair", description: "Repair for AC, fridge, washing machine", slug: "appliances" },
    { title: "🌿 Gardening", description: "Landscaping and garden maintenance", slug: "gardening" },
    { title: "💄 Beauty", description: "Salon services at home", slug: "beauty" },
    { title: "📦 Moving", description: "Packers and movers services", slug: "movings" },
    { title: "🪳 Pest Control", description: "Termite and bug removal", slug: "pest_control" },
    { title: "💻 IT Support", description: "Computer and network troubleshooting", slug: "it_support" },
    { title: "📚 Tutor", description: "Private lessons and coaching", slug: "tutor" },
  ];

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/providers/${category.slug}`);
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
    setLoading(false);
  };

  const fetchReviews = async (providerId) => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${providerId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setLoadingReviews(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("fullName") || "Anonymous";

    if (!userId) {
      alert("Please login to leave a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProvider._id,
          userId,
          userName,
          rating: newRating,
          comment: newComment
        })
      });

      const data = await res.json();
      if (data.success) {
        setNewComment("");
        setNewRating(5);
        fetchReviews(selectedProvider._id);

        // Update local selected provider rating
        setSelectedProvider({
          ...selectedProvider,
          rating: data.newAggregateRating
        });
      }
    } catch (error) {
      alert("Error submitting review");
    }
    setSubmittingReview(false);
  };

  const handleBookingNext = () => {
    if (bookingStep === 'address') {
      if (!bookingAddress.trim()) {
        alert("Please provide a service address");
        return;
      }
      if (!bookingPhone.trim()) {
        alert("Please provide a contact number");
        return;
      }
    }
    setBookingStep(bookingStep === 'address' ? 'payment' : 'success');
  };

  const processPayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === 'online' && (!bookingAmount || Number(bookingAmount) <= 0)) {
      alert("Please enter a valid payment amount");
      return;
    }

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("fullName");

    const finalizeBooking = async (paidOnline = false) => {
      const bookingData = {
        userId,
        providerId: selectedProvider._id,
        userName,
        userPhone: bookingPhone,
        userAddress: bookingAddress,
        serviceCategory: selectedCategory.title,
        description: bookingDescription || "Service requested from dashboard",
        isEmergency,
        paymentMethod,
        paidOnline
      };

      try {
        const res = await fetch(`${API_BASE_URL}/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });

        const data = await res.json();
        if (data.success) {
          setBookingStep('success');
        } else {
          alert("Booking failed: " + data.message);
        }
      } catch (error) {
        alert("Error creating booking. Please contact support.");
      }
    };

    if (paymentMethod === 'online') {
      if (!isRazorpayLoaded) {
        alert("Razorpay is still loading. Please wait a moment.");
        return;
      }

      try {
        // 1. Create order on backend (BASE_URL points to backend root)
        const orderRes = await fetch(`${BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(bookingAmount) * 100, // into paise
            currency: "INR",
          }),
        });
        const orderData = await orderRes.json();
        console.log("Order created:", orderData);

        // 2. Open Razorpay Modal
        const options = {
          key: "rzp_test_SaZdBgU1PovX2R", // Use the test key from .env
          amount: orderData.amount,
          currency: orderData.currency,
          name: "NextDoor Connect",
          description: `Booking with ${selectedProvider.fullName}`,
          order_id: orderData.id,
          handler: async (response) => {
            console.log("Razorpay response:", response);
            // 3. Validate payment
            const validateRes = await fetch(`${BASE_URL}/order/validate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const validateData = await validateRes.json();

            if (validateData.msg === "success") {
              finalizeBooking(true);
            } else {
              alert("Payment validation failed. Please try again.");
            }
          },
          prefill: {
            name: userName,
            contact: bookingPhone,
          },
          theme: {
            color: "#00bdb3",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Payment error:", error);
        alert("Error initializing payment gateway.");
      }
    } else {
      // Cash on Delivery
      finalizeBooking(false);
    }
  };

  const resetBooking = () => {
    setSelectedProvider(null);
    setBookingStep(null);
    setPaymentMethod("");
    setReviews([]);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Hero / Search Section */}
      {!selectedCategory && (
        <div className="dashboard-header animate-fade-in">
          <h1>Community Services</h1>
          <p>Find the best local professionals for your needs</p>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for services (e.g., Plumbing, Cleaning)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {!selectedCategory && (
        <div className="category-section">
          <h2 className="section-title">
            {searchTerm ? `Results for "${searchTerm}"` : "All Categories"}
          </h2>

          {filteredCategories.length > 0 ? (
            <div className="category-grid">
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={index}
                  title={category.title}
                  description={category.description}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No services found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm("")}>Clear Search</button>
            </div>
          )}
        </div>
      )}

      {/* Providers List View */}
      {selectedCategory && !selectedProvider && (
        <div className="providers-view">
          <div className="view-header">
            <button className="back-btn-dashboard" onClick={() => setSelectedCategory(null)}>
              ← Back to Categories
            </button>
            <h2>{selectedCategory.title} Professionals</h2>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading professionals...</div>
          ) : providers.length > 0 ? (
            <div className="providers-grid">
              {providers.map((provider) => (
                <div key={provider._id} className="provider-card animate-slide-up" onClick={() => setSelectedProvider(provider)}>
                  <div className="provider-avatar">
                    {provider.fullName.charAt(0)}
                  </div>
                  <div className="provider-info-mini">
                    <h3>{provider.fullName}</h3>
                    <p className="p-rating">⭐ {provider.rating || "5.0"}</p>
                    <p className="p-rate">{provider.hourlyRate || "Contact for Price"}</p>
                  </div>
                  <button className="view-more-btn">View Details</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-providers">
              <p>No verified {selectedCategory.title.toLowerCase()} providers found in your area yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Provider Details View */}
      {selectedProvider && (
        <div className="provider-details-overlay" onClick={resetBooking}>
          <div className="provider-details-modal" onClick={(e) => {
            e.stopPropagation();
            if (!bookingStep && reviews.length === 0 && !loadingReviews) fetchReviews(selectedProvider._id);
          }}>
            <button className="close-details" onClick={resetBooking}>×</button>

            {!bookingStep ? (
              <>
                <div className="details-header">
                  <div className="details-avatar">
                    {selectedProvider.fullName.charAt(0)}
                  </div>
                  <div className="details-title">
                    <h2>{selectedProvider.fullName}</h2>
                    <p className="details-badge">Verified Professional</p>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="details-section">
                    <h4>Service Details</h4>
                    <p><strong>Category:</strong> {selectedCategory.title}</p>
                    <p><strong>Description:</strong> {selectedProvider.serviceDescription || "Experienced professional providing quality service."}</p>
                    <p><strong>Availability:</strong> {selectedProvider.availableTime || "Flexible"}</p>
                    <p><strong>Starting Price:</strong> {selectedProvider.hourlyRate || "Custom Quote"}</p>
                  </div>

                  <div className="details-section">
                    <h4>Contact Info</h4>
                    <p><strong>Address:</strong> {selectedProvider.address || "Community Area"}</p>
                    <p><strong>Phone:</strong> {selectedProvider.phone}</p>
                    <p><strong>Email:</strong> {selectedProvider.email}</p>
                  </div>

                  <div className="details-section rating-section">
                    <h4>Aggregate Rating</h4>
                    <div className="stars">⭐ {selectedProvider.rating || "5.0"}</div>
                    <p>Based on community feedback.</p>
                  </div>
                </div>

                {/* REVIEWS LIST */}
                <div className="reviews-container">
                  <h3>Community Reviews ({reviews.length})</h3>
                  {loadingReviews ? (
                    <p>Loading reviews...</p>
                  ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.map((rev) => (
                        <div key={rev._id} className="review-card">
                          <div className="review-card-header">
                            <strong>{rev.userName}</strong>
                            <span className="review-stars">{"⭐".repeat(rev.rating)}</span>
                          </div>
                          <p className="review-comment">{rev.comment}</p>
                          <small className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-reviews-text">No reviews yet. Be the first to rate!</p>
                  )}
                </div>

                {/* ADD REVIEW FORM */}
                <div className="add-review-section">
                  <h3>Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="rating-input-group">
                      <label>Your Rating:</label>
                      <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Good</option>
                        <option value="3">3 Stars - Average</option>
                        <option value="2">2 Stars - Poor</option>
                        <option value="1">1 Star - Terrible</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience with this professional..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                      {submittingReview ? "Submitting..." : "Post Review"}
                    </button>
                  </form>
                </div>

                <div className="details-actions">
                  <button className="book-now-btn" onClick={() => setBookingStep('address')}>
                    Book Now
                  </button>
                  <button className="contact-btn" onClick={() => window.location.href = `tel:${selectedProvider.phone}`}>
                    Call Professional
                  </button>
                </div>
              </>
            ) : bookingStep === 'address' ? (
              <div className="booking-step-view animate-fade-in">
                <div className="booking-header">
                  <h2>Confirm Service Address</h2>
                  <p>Where should {selectedProvider.fullName} visit?</p>
                </div>

                <div className="address-input-section">
                  <div className="input-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="Verify your phone number..."
                      className="booking-input"
                    />
                  </div>

                  <div className="input-group">
                    <label>Service Location</label>
                    <textarea
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="Enter your full home or office address..."
                      className="booking-textarea"
                    ></textarea>
                    <p className="helper-text">Defaults to your registered address.</p>
                  </div>

                  <div className="input-group">
                    <div className="emergency-toggle-flex">
                      <label>Emergency Service?</label>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isEmergency}
                          onChange={(e) => setIsEmergency(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <p className="helper-text">Toggle this if you need immediate assistance!</p>
                  </div>

                  <div className="input-group">
                    <label>Additional Description</label>
                    <textarea
                      value={bookingDescription}
                      onChange={(e) => setBookingDescription(e.target.value)}
                      placeholder="Any specific instructions for the professional? (e.g., entrance details, issue specifics...)"
                      className="booking-textarea"
                    ></textarea>
                  </div>
                </div>

                <div className="details-actions">
                  <button className="contact-btn" onClick={() => setBookingStep(null)}>Back</button>
                  <button className="book-now-btn" onClick={handleBookingNext}>Next: Payment</button>
                </div>
              </div>
            ) : bookingStep === 'payment' ? (
              <div className="booking-step-view animate-fade-in">
                <div className="booking-header">
                  <h2>Choose Payment Method</h2>
                  <p>Safe and secure transactions</p>
                </div>

                <div className="payment-options">
                  <div
                    className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-icon">💵</div>
                    <div className="payment-info">
                      <h4>Cash on Delivery</h4>
                      <p>Pay after service completion</p>
                    </div>
                  </div>

                  <div
                    className={`payment-card ${paymentMethod === 'online' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="payment-icon">💳</div>
                    <div className="payment-info">
                      <h4>Online Payment</h4>
                      <p>Pay securely via Razorpay</p>
                    </div>
                  </div>

                  {paymentMethod === 'online' && (
                    <div className="amount-input-section animate-fade-in">
                      <label>Enter Amount to Pay (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={bookingAmount}
                        onChange={(e) => setBookingAmount(e.target.value)}
                        className="booking-amount-input"
                      />
                      <p className="helper-text">This will be processed in Test Mode.</p>
                    </div>
                  )}
                </div>

                <div className="details-actions">
                  <button className="contact-btn" onClick={() => setBookingStep('address')}>Back</button>
                  <button className="book-now-btn" onClick={processPayment}>Confirm Booking</button>
                </div>
              </div>
            ) : (
              <div className="booking-success animate-fade-in">
                <div className="success-icon">🎉</div>
                <h2>Booking Confirmed!</h2>
                <p>Your request has been sent to <strong>{selectedProvider.fullName}</strong>.</p>
                <p>They will arrive at your address soon.</p>

                <div className="booking-summary">
                  <div className="sum-item"><span>Address:</span> {bookingAddress}</div>
                  <div className="sum-item"><span>Method:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Prepaid)'}</div>
                </div>

                <button className="book-now-btn" onClick={resetBooking}>View More Services</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ChatbotWidget onBookService={(serviceTitle) => {
        const category = categories.find(c => c.title.toLowerCase().includes(serviceTitle.toLowerCase()));
        if (category) {
          handleCategoryClick(category);
        }
      }} />
    </div>
  );
}

export default Dashboard;
