import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const testLogin = async (identifier, password, role) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Checking login for: ${identifier}, ${role}`);

        const user = await User.findOne({
            role,
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!user) {
            console.log("❌ User not found");
            mongoose.connection.close();
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch");
        } else {
            console.log("✅ Login successful");
            console.log("User details:", {
                role: user.role,
                isVerified: user.isVerified,
            });
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("error:", error);
        mongoose.connection.close();
    }
};

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Usage: node testLogin.js <identifier> <password> <role>");
} else {
    testLogin(args[0], args[1], args[2]);
}
