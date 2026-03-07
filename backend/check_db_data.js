import mongoose from "mongoose";
import dotenv from "dotenv";
import Feedback from "./models/Feedback.js";
import Complaint from "./models/Complaint.js";

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextdoor_connect");
        console.log("Connected to MongoDB");

        const feedbacks = await Feedback.find();
        console.log(`Feedbacks found: ${feedbacks.length}`);
        if (feedbacks.length > 0) {
            console.log("Sample Feedback:", JSON.stringify(feedbacks[0], null, 2));
        }

        const complaints = await Complaint.find();
        console.log(`Complaints found: ${complaints.length}`);
        if (complaints.length > 0) {
            console.log("Sample Complaint:", JSON.stringify(complaints[0], null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

checkData();
