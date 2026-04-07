import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

const STEPS = ["Delivery", "Payment", "Confirmation"];

function Checkout() {
  const navigate = useNavigate();
  const product = JSON.parse(localStorage.getItem("buyNowProduct") || "null");

  const [step, setStep] = useState(1);

  // Step 1 fields
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [step1Err, setStep1Err] = useState({});

  // Step 2 fields
  const [payMethod, setPayMethod] = useState("cod");
  const [onlineSub, setOnlineSub] = useState("upi");

  // Step 3 — order placed
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!product) {
    return (
      <div className="co-error">
        <h2>No product selected</h2>
        <button onClick={() => navigate("/products")}>← Go to Products</button>
      </div>
    );
  }

  // Validation step 1
  const validateStep1 = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Name is required";
    if (!phone.trim() || phone.length < 10) errs.phone = "Valid phone required";
    if (!address.trim()) errs.address = "Address is required";
    if (!pincode.trim() || pincode.length < 6) errs.pincode = "Valid 6-digit pincode required";
    setStep1Err(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    localStorage.removeItem("buyNowProduct");
    localStorage.removeItem("cart");
    setOrderPlaced(true);
  };

  const hasRealImg = product.image &&
    !product.image.includes("via.placeholder.com") &&
    !product.image.includes("placehold.co");

  return (
    <div className="co-page">
      {/* Progress */}
      <div className="co-progress">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`co-step ${step >= i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
              <div className="co-step-circle">{step > i + 1 ? "✓" : i + 1}</div>
              <span>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`co-line ${step > i + 1 ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="co-layout">
        {/* ── ORDER SUMMARY (always visible) ── */}
        <div className="co-summary-card">
          <h3 className="co-card-title">Order Summary</h3>
          <div className="co-prod-row">
            {hasRealImg ? (
              <img src={product.image} alt={product.title} className="co-prod-img" />
            ) : (
              <div className="co-prod-img-placeholder">📦</div>
            )}
            <div>
              <p className="co-prod-title">{product.title}</p>
              <p className="co-prod-qty">Qty: {product.qty || 1}</p>
            </div>
          </div>
          <div className="co-summary-rows">
            <div className="co-sum-row"><span>Item Price</span><span>₹ {product.price?.toLocaleString()}</span></div>
            <div className="co-sum-row"><span>Qty</span><span>× {product.qty || 1}</span></div>
            <div className="co-sum-row total"><span>Total</span><span>₹ {((product.price || 0) * (product.qty || 1)).toLocaleString()}</span></div>
          </div>
        </div>

        {/* ── STEPS ── */}
        <div className="co-main">

          {/* ORDER PLACED SUCCESS */}
          {orderPlaced ? (
            <div className="co-success-card">
              <div className="co-success-icon">✅</div>
              <h2>Order Placed Successfully!</h2>
              <p>Your order has been confirmed. Thank you for shopping with NextDoor Connect!</p>
              <div className="co-confirm-details">
                <div className="co-confirm-row"><b>Product</b><span>{product.title}</span></div>
                <div className="co-confirm-row"><b>Deliver to</b><span>{address}, {pincode}</span></div>
                <div className="co-confirm-row"><b>Name</b><span>{fullName}</span></div>
                <div className="co-confirm-row"><b>Phone</b><span>{phone}</span></div>
                <div className="co-confirm-row"><b>Payment</b><span>{payMethod === "cod" ? "Cash on Delivery" : `Online — ${onlineSub.toUpperCase()}`}</span></div>
                <div className="co-confirm-row"><b>Total Paid</b><span>₹ {((product.price || 0) * (product.qty || 1)).toLocaleString()}</span></div>
              </div>
              <button className="co-btn-primary" onClick={() => navigate("/products")}>🏠 Go to Products</button>
            </div>
          ) : (

            <>
              {/* STEP 1 – Delivery */}
              {step === 1 && (
                <div className="co-card co-animate">
                  <h2 className="co-card-title">Confirm Your Delivery Location</h2>
                  <div className="co-form-group">
                    <label>Full Name *</label>
                    <input className={`co-input ${step1Err.fullName ? "err" : ""}`} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" />
                    {step1Err.fullName && <span className="co-err-msg">{step1Err.fullName}</span>}
                  </div>
                  <div className="co-form-group">
                    <label>Phone Number *</label>
                    <div className="co-phone-wrap">
                      <span className="co-phone-code">+91</span>
                      <input className={`co-input co-phone-field ${step1Err.phone ? "err" : ""}`} value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
                    </div>
                    {step1Err.phone && <span className="co-err-msg">{step1Err.phone}</span>}
                  </div>
                  <div className="co-form-group">
                    <label>Address Line *</label>
                    <textarea className={`co-textarea ${step1Err.address ? "err" : ""}`} value={address} onChange={e => setAddress(e.target.value)} placeholder="House no., Street, City" rows={3} />
                    {step1Err.address && <span className="co-err-msg">{step1Err.address}</span>}
                  </div>
                  <div className="co-form-group">
                    <label>Pincode *</label>
                    <input className={`co-input ${step1Err.pincode ? "err" : ""}`} value={pincode} onChange={e => setPincode(e.target.value)} placeholder="6-digit pincode" maxLength={6} />
                    {step1Err.pincode && <span className="co-err-msg">{step1Err.pincode}</span>}
                  </div>
                  <button className="co-btn-primary" onClick={() => { if (validateStep1()) setStep(2); }}>Continue →</button>
                </div>
              )}

              {/* STEP 2 – Payment */}
              {step === 2 && (
                <div className="co-card co-animate">
                  <h2 className="co-card-title">Select Payment Method</h2>

                  <div className={`co-pay-option ${payMethod === "cod" ? "selected" : ""}`} onClick={() => setPayMethod("cod")}>
                    <div className="co-radio-circle">{payMethod === "cod" && <div className="co-radio-dot" />}</div>
                    <div>
                      <p className="co-pay-name">💵 Cash on Delivery</p>
                      <p className="co-pay-desc">Pay when your product is delivered</p>
                    </div>
                  </div>

                  <div className={`co-pay-option ${payMethod === "online" ? "selected" : ""}`} onClick={() => setPayMethod("online")}>
                    <div className="co-radio-circle">{payMethod === "online" && <div className="co-radio-dot" />}</div>
                    <div>
                      <p className="co-pay-name">💳 Online Payment</p>
                      <p className="co-pay-desc">Pay securely via UPI, Card, or Net Banking</p>
                    </div>
                  </div>

                  {payMethod === "online" && (
                    <div className="co-online-sub">
                      {[{ id: "upi", label: "🔵 UPI" }, { id: "card", label: "💳 Credit/Debit Card" }, { id: "netbanking", label: "🏦 Net Banking" }].map(opt => (
                        <div
                          key={opt.id}
                          className={`co-sub-option ${onlineSub === opt.id ? "selected" : ""}`}
                          onClick={() => setOnlineSub(opt.id)}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="co-action-row">
                    <button className="co-btn-secondary" onClick={() => setStep(1)}>← Back</button>
                    <button className="co-btn-primary" onClick={() => setStep(3)}>Review Order →</button>
                  </div>
                </div>
              )}

              {/* STEP 3 – Review & Place Order */}
              {step === 3 && (
                <div className="co-card co-animate">
                  <h2 className="co-card-title">Review & Place Order</h2>
                  <div className="co-review-section">
                    <h4>📦 Delivery Details</h4>
                    <p>{fullName}</p>
                    <p>+91 {phone}</p>
                    <p>{address} — {pincode}</p>
                  </div>
                  <div className="co-review-section">
                    <h4>💳 Payment</h4>
                    <p>{payMethod === "cod" ? "Cash on Delivery" : `Online — ${onlineSub.toUpperCase()}`}</p>
                  </div>
                  <div className="co-review-section">
                    <h4>🧾 Total</h4>
                    <p className="co-review-total">₹ {((product.price || 0) * (product.qty || 1)).toLocaleString()}</p>
                  </div>
                  <div className="co-action-row">
                    <button className="co-btn-secondary" onClick={() => setStep(2)}>← Back</button>
                    <button className="co-btn-place" onClick={handlePlaceOrder}>🚀 Place Order</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
