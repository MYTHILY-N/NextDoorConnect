import Complaint from "../models/Complaint.js";
import { sendComplaintStatusEmail } from "../services/mailService.js";

export const createComplaint = async (req, res) => {
    try {
        const { userId, fullName, email, phone, description } = req.body;

        const newComplaint = new Complaint({
            userId,
            fullName,
            email,
            phone,
            description,
            attachment: req.file ? req.file.path : null,
        });

        await newComplaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: newComplaint,
        });
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

export const getAllComplaints = async (req, res) => {
    try {
        // Auto-delete resolved complaints older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await Complaint.deleteMany({
            status: "resolved",
            updatedAt: { $lt: thirtyDaysAgo }
        });

        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminMessage } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        // Send email for status updates (resolved or rejected)
        if (status === "resolved" || status === "rejected") {
            try {
                await sendComplaintStatusEmail(updatedComplaint, status);
            } catch (emailError) {
                console.error("Email notification failed:", emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: `Complaint status updated to ${status} successfully. Notification email triggered.`,
            complaint: updatedComplaint,
        });
    } catch (error) {
        console.error("Error updating complaint status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
