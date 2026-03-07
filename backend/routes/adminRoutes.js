import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users & providers
router.get("/users", async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } });
  res.json(users);
});

// Verify user/provider
router.put("/verify/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isVerified: true,
  });
  res.json({ success: true });
});

// Reject user/provider
router.put("/reject/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error rejecting user" });
  }
});

export default router;
