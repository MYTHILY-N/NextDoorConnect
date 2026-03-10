import Review from "../models/Review.js";
import User from "../models/User.js";

export const addReview = async (req, res) => {
    try {
        const { providerId, userId, userName, rating, comment } = req.body;

        if (!providerId || !userId || !rating || !comment) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newReview = new Review({
            providerId,
            userId,
            userName,
            rating,
            comment
        });

        await newReview.save();

        // Update provider's aggregate rating
        const reviews = await Review.find({ providerId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

        await User.findByIdAndUpdate(providerId, {
            rating: parseFloat(avgRating.toFixed(1))
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview,
            newAggregateRating: avgRating.toFixed(1)
        });
    } catch (error) {
        console.error("❌ Add Review Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProviderReviews = async (req, res) => {
    try {
        const { providerId } = req.params;
        const reviews = await Review.find({ providerId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("❌ Get Reviews Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
