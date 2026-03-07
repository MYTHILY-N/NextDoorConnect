import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "./backend/.env" });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      console.log("Admin Email:", existingAdmin.email);
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin user
    const admin = new User({
      fullName: "Admin User",
      email: "admin@nextdoor.com",
      phone: "9999999999",
      password: hashedPassword,
      address: "Admin HQ",
      role: "admin",
      addressProof: "admin-proof.pdf",
      isVerified: true,
    });

    await admin.save();

    console.log("✅ Admin account created successfully!");
    console.log("📧 Email: admin@nextdoor.com");
    console.log("🔑 Password: Admin@123");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
