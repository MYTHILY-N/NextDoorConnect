import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState({
    field: "",
    message: "",
  });

  const [unverified, setUnverified] = useState(false);
  const [unverifiedName, setUnverifiedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ field: "", message: "" });
    setUnverified(false);
    setLoading(true);

    try {
      console.log("🔐 Login attempt with:", formData);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          identifier: formData.identifier.trim(),
        }),
      });

      const data = await res.json();
      console.log("📩 Backend response:", data);

      // If user is not verified
      if (data.unverified) {
        console.log("⏳ User not verified yet");
        setUnverified(true);
        setUnverifiedName(data.fullName);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.warn("❌ Login failed:", data.message);
        setError({
          field: data.field,
          message: data.message,
        });
        setLoading(false);
        return;
      }

      // LOGIN SUCCESS → DASHBOARD
      if (data.success) {
        // store login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);
        if (data.fullName) localStorage.setItem("fullName", data.fullName);
        if (data.email) localStorage.setItem("email", data.email);
        if (data.phone) localStorage.setItem("phone", data.phone);

        setLoading(false);

        // 🚀 navigate to role-based home/dashboard
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // Send both 'user' and 'provider' to '/user/home'
          navigate("/user/home");
        }

      } else {
        setError({
          field: "general",
          message: data.message || "Invalid response from server",
        });
        setLoading(false);
      }

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError({
        field: "general",
        message: "Backend not responding: " + err.message,
      });
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      {/* Unverified User Screen */}
      {unverified && (
        <div className="login-card" style={{ textAlign: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#00bdb3",
            color: "white",
            fontSize: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 25px",
            fontWeight: "bold"
          }}>
            ✓
          </div>
          <h2 style={{ fontSize: "28px", color: "#333", marginBottom: "15px" }}>
            Thank You, {unverifiedName}!
          </h2>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Your registration has been submitted successfully.
          </p>
          <p style={{
            fontSize: "18px",
            color: "#00bdb3",
            fontWeight: "600",
            margin: "20px 0 15px"
          }}>
            Please wait for admin verification.
          </p>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "30px" }}>
            We will review your documents and contact you within 24-48 hours.
          </p>
          <button
            className="login-btn-main"
            onClick={() => navigate("/")}
            style={{ marginBottom: "0" }}
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Normal Login Form */}
      {!unverified && (
        <div className="login-card">
          <div className="back-btn" onClick={() => navigate("/welcome")}>
            ← Back to Welcome
          </div>
          <h1 className="login-title">Welcome Back 👋</h1>
          <p className="login-subtitle">
            Login to continue connecting with your community
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email or Phone Number"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
            {error.field === "identifier" && (
              <p className="error-text">{error.message}</p>
            )}

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
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
            {error.field === "password" && (
              <p className="error-text">{error.message}</p>
            )}

            <div className="role-select">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                User
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="provider"
                  checked={formData.role === "provider"}
                  onChange={handleChange}
                />
                Service Provider
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Admin
              </label>
            </div>

            <button type="submit" className="login-btn-main" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error.field === "general" && (
              <p className="error-text">{error.message}</p>
            )}
          </form>

          <p className="register-link">
            Don't have an account?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
