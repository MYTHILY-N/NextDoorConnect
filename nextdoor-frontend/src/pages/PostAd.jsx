import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostAd.css";
import API_BASE_URL from "../api";

const CATEGORIES = [
  {
    name: "Cars", icon: "🚗",
    subcategories: ["Cars", "Car Accessories", "Car Spare Parts"]
  },
  {
    name: "Properties", icon: "🏠",
    subcategories: ["For Sale: Houses & Apartments", "For Rent: Houses & Apartments", "Plots & Land", "For Rent: Shops & Offices", "PG & Guest Houses"]
  },
  {
    name: "Mobiles", icon: "📱",
    subcategories: ["Mobile Phones", "Accessories", "Tablets"]
  },
  {
    name: "Jobs", icon: "💼",
    subcategories: ["Data Entry & Back Office", "Sales & Marketing", "BPO & Telecaller", "Driver", "Office Assistant", "Delivery & Collection"]
  },
  {
    name: "Bikes", icon: "🏍️",
    subcategories: ["Motorcycles", "Scooters", "Bicycle", "Spare Parts", "Accessories"]
  },
  {
    name: "Electronics & Appliances", icon: "📺",
    subcategories: ["TVs, Video — Audio", "Kitchen & Other Appliances", "Computers & Laptops", "Cameras & Lenses", "Games & Entertainment", "ACs", "Washing Machines"]
  },
  {
    name: "Commercial Vehicles & Spares", icon: "🚚",
    subcategories: ["Commercial & Other Vehicles", "Spare Parts"]
  },
  {
    name: "Furniture", icon: "🪑",
    subcategories: ["Sofa & Dining", "Beds & Wardrobes", "Home Decor & Garden", "Kids Furniture", "Other Household Items"]
  },
  {
    name: "Fashion", icon: "👗",
    subcategories: ["Men", "Women", "Kids"]
  },
  {
    name: "Books, Sports & Hobbies", icon: "🎸",
    subcategories: ["Books", "Gym & Fitness", "Musical Instruments", "Sports Equipment", "Other Hobbies"]
  },
];

const BRANDS = {
  "Mobile Phones": ["Samsung", "Apple", "Xiaomi", "OnePlus", "Vivo", "Oppo", "Realme", "Nokia"],
  "Cars": ["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra", "Kia", "Ford"],
  "Motorcycles": ["Hero", "Honda", "Bajaj", "TVS", "Royal Enfield", "Yamaha", "Suzuki"],
  "TVs, Video — Audio": ["Samsung", "LG", "Sony", "Mi", "Vu", "Panasonic"],
};

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

function PostAd() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Step 2 state
  const [brand, setBrand] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 3 state
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);   // preview blob URLs
  const [imageFiles, setImageFiles] = useState([]);  // actual File objects
  const fileInputRef = useRef(null);

  // Step 4 state
  const [state, setState] = useState("");
  const [name, setName] = useState(localStorage.getItem("fullName") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [posting, setPosting] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newPreviews].slice(0, 6));
    setImageFiles((prev) => [...prev, ...files].slice(0, 6));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);

    const sellerId = localStorage.getItem("userId");

    // Build a FormData object to support multipart image upload
    const formData = new FormData();
    formData.append("title", adTitle);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", selectedCategory?.name || "");
    formData.append("subcategory", selectedSubcategory || "");
    formData.append("brand", brand || "Other");
    formData.append("location", state);
    formData.append("isFeatured", "false");
    formData.append("sellerName", name);
    formData.append("sellerPhone", `+91${phone}`);
    if (sellerId) formData.append("sellerId", sellerId);
    // Attach the first image file (if any)
    if (imageFiles.length > 0) {
      formData.append("image", imageFiles[0]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        body: formData, // No Content-Type header — browser sets it automatically for FormData
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 Your ad has been posted successfully!");
        navigate("/products");
      } else {
        alert(data.message || "Failed to post the ad. Try again.");
      }
    } catch (err) {
      console.error("Error posting ad:", err);
      alert("⚠️ Cannot reach the server. Please check if the backend is running.");
    } finally {
      setPosting(false);
    }
  };

  const progressSteps = [
    { label: "Category", num: 1 },
    { label: "Details", num: 2 },
    { label: "Photos & Price", num: 3 },
    { label: "Location", num: 4 },
  ];

  return (
    <div className="post-ad-page">
      {/* Progress Bar */}
      <div className="post-ad-progress">
        {progressSteps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`progress-step ${step >= s.num ? "active" : ""} ${step > s.num ? "done" : ""}`}>
              <div className="step-circle">{step > s.num ? "✓" : s.num}</div>
              <span className="step-label">{s.label}</span>
            </div>
            {i < progressSteps.length - 1 && (
              <div className={`progress-line ${step > s.num ? "done" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="post-ad-container">
        <h1 className="post-ad-title">POST YOUR AD</h1>

        {/* ───── STEP 1: Category Selection ───── */}
        {step === 1 && (
          <div className="step-card animate-step">
            <h2 className="step-subtitle">Choose a Category</h2>
            <div className="category-selector">
              {/* Left panel */}
              <ul className="main-category-list">
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat.name}
                    className={`main-cat-item ${selectedCategory?.name === cat.name ? "selected" : ""}`}
                    onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(null); }}
                  >
                    <span className="cat-emoji">{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="cat-arrow">›</span>
                  </li>
                ))}
              </ul>

              {/* Right panel */}
              <div className="sub-category-panel">
                {selectedCategory ? (
                  <>
                    <h3 className="sub-panel-title">{selectedCategory.name}</h3>
                    <ul className="sub-category-list">
                      {selectedCategory.subcategories.map((sub) => (
                        <li
                          key={sub}
                          className={`sub-cat-item ${selectedSubcategory === sub ? "selected" : ""}`}
                          onClick={() => { setSelectedSubcategory(sub); setTimeout(() => setStep(2), 200); }}
                        >
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="sub-panel-placeholder">
                    <span>👈</span>
                    <p>Select a category to see subcategories</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ───── STEP 2: Product Details Form ───── */}
        {step === 2 && (
          <div className="step-card animate-step">
            {/* Breadcrumb */}
            <div className="breadcrumb-bar">
              <span className="breadcrumb-text">
                {selectedCategory?.name} / {selectedSubcategory}
              </span>
              <button className="change-link" onClick={() => setStep(1)}>Change</button>
            </div>

            <h2 className="step-subtitle">Include Some Details</h2>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <select className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">Select Brand</option>
                {(BRANDS[selectedSubcategory] || BRANDS[selectedCategory?.name] || ["Other"]).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ad Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
                value={adTitle}
                maxLength={70}
                onChange={(e) => setAdTitle(e.target.value)}
              />
              <span className="char-counter">{adTitle.length} / 70</span>
            </div>

            <div className="form-group">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Include condition, features and reason for selling"
                value={description}
                maxLength={4096}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="char-counter">{description.length} / 4096</span>
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary"
                disabled={!adTitle.trim() || !description.trim()}
                onClick={() => setStep(3)}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* ───── STEP 3: Price + Photos ───── */}
        {step === 3 && (
          <div className="step-card animate-step">
            <h2 className="step-subtitle">Set a Price</h2>
            <div className="form-group">
              <label className="form-label">Price <span className="required">*</span></label>
              <div className="price-input-wrapper">
                <span className="price-symbol">₹</span>
                <input
                  type="number"
                  className="form-input price-field"
                  placeholder="Enter amount"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <h2 className="step-subtitle mt-24">Upload Up To 6 Photos</h2>
            <div className="photo-upload-grid">
              {/* Add Photo box */}
              <div className="photo-box add-photo" onClick={() => fileInputRef.current?.click()}>
                <span className="add-photo-icon">📷</span>
                <span>Add Photo</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              {/* Uploaded previews */}
              {images.map((src, i) => (
                <div key={i} className="photo-box preview-box">
                  <img src={src} alt={`upload-${i}`} />
                  <button className="remove-photo-btn" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
              {/* Empty placeholder boxes */}
              {Array.from({ length: Math.max(0, 5 - images.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="photo-box empty-box">
                  <span className="empty-photo-icon">🖼️</span>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <p className="validation-hint">📌 At least one photo is recommended</p>
            )}

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button
                className="btn-primary"
                disabled={!price}
                onClick={() => setStep(4)}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* ───── STEP 4: Location + User Details ───── */}
        {step === 4 && (
          <form className="step-card animate-step" onSubmit={handleSubmit}>
            <h2 className="step-subtitle">Confirm Your Location</h2>
            <div className="form-group">
              <label className="form-label">State <span className="required">*</span></label>
              <select className="form-input" value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <h2 className="step-subtitle mt-24">Review Your Details</h2>
            <div className="user-review-section">
              <div className="user-avatar-large">{name.charAt(0).toUpperCase() || "U"}</div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="char-counter">{name.length} / 60</span>
              </div>
            </div>

            <h2 className="step-subtitle mt-24">Verify Account</h2>
            <p className="verify-hint">We will send you a confirmation code via SMS</p>
            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <div className="phone-input-wrapper">
                <span className="phone-code">+91</span>
                <input
                  type="tel"
                  className="form-input phone-field"
                  placeholder="Enter your phone number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(3)}>Back</button>
              <button
                type="submit"
                className="btn-primary btn-post"
                disabled={!state || !name.trim() || posting}
              >
                {posting ? "⏳ Posting..." : "🚀 Post Now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PostAd;
