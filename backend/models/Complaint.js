import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        attachment: {
            type: String, // file path
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
