import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
    try {
        const { name, contact, rating, message } = req.body;

        const newFeedback = new Feedback({
            name,
            contact,
            rating,
            message,
        });

        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback: newFeedback,
        });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
