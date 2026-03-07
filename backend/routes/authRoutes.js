import express from "express";
import multer from "multer";
import { registerUser } from "../controllers/authController.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* ===== MULTER CONFIG ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===== REGISTER ROUTE ===== */
router.post(
  "/register",
  upload.fields([
    { name: "addressProof", maxCount: 1 },
    { name: "serviceDoc", maxCount: 1 },
  ]),
  registerUser
);
// Login route (email or phone + password)
router.post("/login", async (req, res) => {
  const { identifier, password, role } = req.body;
  const trimmedIdentifier = identifier ? identifier.trim() : "";

  try {
    console.log(`🔐 Login Attempt: role=${role}, identifier="${trimmedIdentifier}"`);

    // 1️⃣ Find user by identifier + role
    const user = await User.findOne({
      role,
      $or: [{ email: trimmedIdentifier }, { phone: trimmedIdentifier }],
    });

    if (!user) {
      console.warn(`❌ Login Failed: User not found for role=${role}, identifier="${trimmedIdentifier}"`);
      return res.status(400).json({
        field: "identifier",
        message: "Invalid email / phone or role",
      });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        field: "password",
        message: "Incorrect password",
      });
    }

    // 3️⃣ If unverified (and not admin), show pending verification screen
    if (user.role !== "admin" && !user.isVerified) {
      return res.json({
        unverified: true,
        fullName: user.fullName,
      });
    }

    // 4️⃣ Login success
    res.json({
      success: true,
      role: user.role,
      userId: user._id,
      isVerified: user.isVerified,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      field: "general",
      message: "Server error",
    });
  }
});


export default router;
