import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    console.log("Checking connection to:", process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@')); // Hide password
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of default 30s
        });
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED: Connection error details:");
        console.error(err);
        process.exit(1);
    }
};

testConnection();
