import express from "express";
import User from "../models/User.js";

import { sendVerificationEmail } from "../services/mailService.js";

const router = express.Router();

// Get all users & providers
router.get("/users", async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } });
  res.json(users);
});

// Verify user/provider
router.put("/verify/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isVerified: true,
      status: "verified"
    }, { new: true });
    
    if (user) {
      await sendVerificationEmail(user, "verified");
    }
    res.json({ success: true, message: "User verified and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error verifying user" });
  }
});

// Reject user/provider
router.put("/reject/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isVerified: false,
      status: "rejected"
    }, { new: true });

    if (user) {
      await sendVerificationEmail(user, "rejected");
    }
    res.json({ success: true, message: "User rejected and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error rejecting user" });
  }
});

export default router;
