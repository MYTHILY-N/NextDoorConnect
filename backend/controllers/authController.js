import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      address,
      role,
    } = req.body;

    console.log("📋 Registration Data Received:", {
      fullName,
      email,
      phone,
      role,
      address,
      addressProof: req.files?.addressProof?.[0]?.filename,
      serviceDoc: req.files?.serviceDoc?.[0]?.filename,
    });

    // Validation
    if (!fullName || !email || !phone || !password || !role) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.addressProof) {
      console.warn("⚠️ No address proof file uploaded");
      return res.status(400).json({ message: "Address proof file is required" });
    }

    if (role === "provider" && !req.files?.serviceDoc) {
      console.warn("⚠️ Service provider missing service document");
      return res.status(400).json({ message: "Service document is required for providers" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      address,
      role,
      addressProof: req.files.addressProof[0].path,
      serviceDoc:
        role === "provider"
          ? req.files.serviceDoc[0].path
          : null,
    });

    await user.save();

    console.log("✅ User registered successfully:", user._id);

    res.status(201).json({
      message: "Registration successful. Await admin verification.",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
