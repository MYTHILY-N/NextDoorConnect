import express from "express";
import {
    getProvidersByDomain,
    getUserById,
    updateUserProfile,
    deleteUserAccount,
    getCart,
    addToCart,
    removeFromCart,
    getFavorites,
    toggleFavorite
} from "../controllers/userController.js";

const router = express.Router();

router.get("/providers/:domain", getProvidersByDomain);
router.get("/:id", getUserById);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUserAccount);

// Cart Routes
router.get("/:id/cart", getCart);
router.post("/:id/cart", addToCart);
router.delete("/:id/cart/:productId", removeFromCart);

// Favorites Routes
router.get("/:id/favorites", getFavorites);
router.post("/:id/favorites", toggleFavorite);

export default router;
