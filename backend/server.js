import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

dotenv.config();

const app = express();
import Razorpay from "razorpay";

// Start server after DB connection
const startServer = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.warn("⚠️ Warning: Server started without database connection.")
  }

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Serve uploaded files — resolves to backend/uploads/
const __dirname_server = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname_server, "uploads")));

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
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const shadow_signature = razorpay_signature;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.get("/", (req, res) => {
  res.send("NextDoor Connect Backend Running");
});

app.get("/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "✅ Healthy" : "⚠️ Database Not Connected",
    database: isConnected ? "Connected" : "Disconnected",
    server: "Running"
  });
});

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Database: ${connected ? "✅ Connected" : "❌ Not Connected"}`);
  });
};

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
