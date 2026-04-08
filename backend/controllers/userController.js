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

// --- CART CONTROLERS ---
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("cart.product");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { id } = req.params; // userId
        const { productId, quantity = 1 } = req.body;

        const user = await User.findById(id);
        const cartItemIdx = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIdx > -1) {
            user.cart[cartItemIdx].quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const user = await User.findById(id);
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- FAVORITES CONTROLLERS ---
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("favorites");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const user = await User.findById(id);
        const favIdx = user.favorites.indexOf(productId);

        if (favIdx > -1) {
            user.favorites.splice(favIdx, 1);
        } else {
            user.favorites.push(productId);
        }

        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
