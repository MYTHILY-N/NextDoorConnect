import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [files, setFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= VALIDATION HELPERS ================= */

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, PNG, JPG, or JPEG files are allowed");
      return;
    }

    setFiles({ ...files, [key]: file });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName || !nameRegex.test(formData.fullName)) {
      newErrors.fullName = "Name must contain only letters and spaces";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!isPasswordValid) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!role) {
      newErrors.role = "Please select a role";
    }

    if (!files.addressProof) {
      newErrors.addressProof = "Address proof is required";
    }

    if (role === "provider" && !files.serviceDoc) {
      newErrors.serviceDoc = "Service document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();

      // text fields
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("phone", formData.phone.trim());
      data.append("address", formData.address);
      data.append("role", role);

      // files
      data.append("addressProof", files.addressProof);

      if (role === "provider") {
        data.append("serviceDoc", files.serviceDoc);
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Registration failed");
        return;
      }

      // success
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    }
  };


  /* ================= SUCCESS SCREEN ================= */

  if (isSubmitted) {
    return (
      <div className="register-container">
        <div className="thank-you-box">
          <div className="success-icon">✓</div>
          <h2>Thank You, {formData.fullName}!</h2>
          <p>Your registration has been submitted successfully.</p>
          <p className="verification-message">
            Please wait for admin verification.
          </p>
          <button className="back-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div className="register-container">
      <button className="back-btn-form" onClick={() => navigate("/welcome")}>
        ← Back to Welcome
      </button>
      <h1>Register to NextDoor Connect</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}

        <input
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleInputChange}
          maxLength="10"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => setPasswordFocused(true)}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </span>
        </div>

        {/* PASSWORD RULES - Show only when focused */}
        {passwordFocused && (
          <div className="password-rules">
            <p className={passwordChecks.length ? "valid" : ""}>✔ Min 8 characters</p>
            <p className={passwordChecks.upper ? "valid" : ""}>✔ One uppercase letter</p>
            <p className={passwordChecks.lower ? "valid" : ""}>✔ One lowercase letter</p>
            <p className={passwordChecks.number ? "valid" : ""}>✔ One number</p>
            <p className={passwordChecks.special ? "valid" : ""}>✔ One special character</p>
          </div>
        )}

        {errors.password && <span className="error">{errors.password}</span>}

        <textarea
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleInputChange}
        />

        {/* ROLE */}
        <div className="role-section">
          <label>
            <input type="radio" name="role" onChange={() => setRole("user")} />
            User
          </label>
          <label>
            <input type="radio" name="role" onChange={() => setRole("provider")} />
            Service Provider
          </label>
        </div>
        {errors.role && <span className="error">{errors.role}</span>}

        {/* UPLOADS */}
        <div className="upload-section">
          <label className="upload-label">
            Upload Address Proof
            <span className="tooltip">
              Upload a valid address proof (Masked Aadhaar - last 4 digits visible, Utility Bill, or Lease Agreement)
            </span>
          </label>
          <input type="file" onChange={(e) => handleFileChange(e, "addressProof")} />
          {errors.addressProof && <span className="error">{errors.addressProof}</span>}
        </div>

        {role === "provider" && (
          <div className="upload-section">
            <label className="upload-label">
              Upload Service Document
              <span className="tooltip">
                Upload your service certificate, license, or qualification document (PDF only)
              </span>
            </label>
            <input type="file" onChange={(e) => handleFileChange(e, "serviceDoc")} />
            {errors.serviceDoc && <span className="error">{errors.serviceDoc}</span>}
          </div>
        )}

        <button type="submit" className="submit-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
