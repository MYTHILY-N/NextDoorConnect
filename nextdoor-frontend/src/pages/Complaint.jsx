import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import "./Complaint.css";

function Complaint() {
    console.log("Complaint component rendered");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // User details from localStorage
    const userId = localStorage.getItem("userId");
    const fullName = localStorage.getItem("fullName") || "User";
    const userEmail = localStorage.getItem("email") || "";
    const userPhone = localStorage.getItem("phone") || "";

    // Redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("isLoggedIn")) {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Only JPG, PNG, or PDF files are allowed");
            return;
        }

        setFile(selectedFile);

        // Create preview for images
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview("pdf"); // Special flag for PDF
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.description.trim()) {
            newErrors.description = "Please describe your complaint";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1️⃣ Validate session data
        if (!userId || userId === "null" || !userEmail || !userPhone) {
            alert("Your session has expired or user info is missing. Please log out and back in to refresh your data.");
            setLoading(false);
            return;
        }

        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = new FormData();
            data.append("userId", userId);
            data.append("fullName", fullName);
            data.append("email", userEmail);
            data.append("phone", userPhone);
            data.append("description", formData.description);
            if (file) {
                data.append("attachment", file);
            }

            const response = await fetch(`${API_BASE_URL}/complaints/submit`, {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ description: "" });
                setFile(null);
                setPreview(null);
            } else {
                alert(result.message || "Failed to submit complaint");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error connecting to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="complaint-container">
            <div className="complaint-content">
                <h2>Submit a Complaint</h2>
                <p className="feedback-subtitle">
                    Having trouble? Tell us about it, and we'll look into it right away.
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
                        <h3>Received!</h3>
                        <p>Your complaint has been registered. Reference: #{Math.floor(Math.random() * 90000) + 10000}</p>
                        <button onClick={() => setIsSubmitted(false)}>File Another</button>
                        <p className="back-to-feedback" onClick={() => navigate("/feedback")}>
                            Back to Feedback
                        </p>
                    </div>
                ) : (
                    <form className="complaint-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="description">Complaint Details</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the issue you're facing..."
                                className={errors.description ? "error-input" : ""}
                                rows="6"
                            ></textarea>
                            {errors.description && (
                                <span className="error-text">{errors.description}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Attachment (Optional - Image or PDF)</label>
                            <div className="file-input-group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                <div className="file-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span>Click to upload or drag and drop</span>
                                    <small>Max file size: 5MB</small>
                                </div>
                            </div>

                            {preview && (
                                <div className="preview-container">
                                    {preview === "pdf" ? (
                                        <div className="pdf-preview">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <span>{file.name}</span>
                                            <button type="button" className="remove-btn" onClick={removeFile}>×</button>
                                        </div>
                                    ) : (
                                        <div className="preview-item">
                                            <img src={preview} alt="Preview" />
                                            <button type="button" className="remove-btn" onClick={removeFile}>×</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Complaint"}
                        </button>
                        <p className="back-to-feedback" onClick={() => navigate("/feedback")}>
                            Cancel
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Complaint;
