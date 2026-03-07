import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173", // Vite default
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002"
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Middleware to check Database connection status
app.use((req, res, next) => {
  const isConnected = mongoose.connection.readyState === 1;
  const isAuthOrAdminOrApi = req.path.startsWith("/api");

  if (isAuthOrAdminOrApi && !isConnected) {
    return res.status(503).json({
      success: false,
      message: "Database connection is not established. Please check server logs and whitelisting.",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => {
  res.send("NextDoor Connect Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
