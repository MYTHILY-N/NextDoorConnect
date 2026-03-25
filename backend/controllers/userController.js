import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

export const getProvidersByDomain = async (req, res) => {
    try {
        const { domain } = req.params;

        // Find verified providers with the specific domain
        // We use a case-insensitive regex match or just lowercase comparison
        const providers = await User.find({
            role: "provider",
            isVerified: true,
            serviceDomain: domain.toLowerCase()
        }).select("-password -addressProof -serviceDoc"); // Exclude sensitive info

        res.status(200).json({
            success: true,
            count: providers.length,
            providers
        });
    } catch (error) {
        console.error("❌ Get Providers Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        console.error("❌ Update Profile Error:", error.message);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ success: false, message: messages.join(", ") });
        } else {
            res.status(500).json({ success: false, message: error.message || "Server error" });
        }
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Cleanup: Delete bookings where this user is either customer or provider
        await Booking.deleteMany({ $or: [{ userId: userId }, { providerId: userId }] });

        // Cleanup: Delete reviews where this user is either author or subject
        await Review.deleteMany({ $or: [{ userId: userId }, { providerId: userId }] });

        // Finally delete the user
        await User.findByIdAndDelete(userId);

        res.json({ success: true, message: "Account and related data deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Account Error:", error);
        res.status(500).json({ success: false, message: "Server error during account deletion" });
    }
};
