import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "./backend/.env" });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        const admins = await User.find({ role: "admin" });
        if (admins.length === 0) {
            console.log("❌ No admin user found in the database!");
        } else {
            console.log(`✅ Found ${admins.length} admin(s):`);
            admins.forEach(admin => {
                console.log({
                    email: admin.email,
                    phone: admin.phone,
                    isVerified: admin.isVerified,
                    role: admin.role
                });
            });
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
        mongoose.connection.close();
    }
};

checkAdmin();
