import express from "express";
import {
    getProvidersByDomain,
    getUserById,
    updateUserProfile,
    deleteUserAccount
} from "../controllers/userController.js";

const router = express.Router();

router.get("/providers/:domain", getProvidersByDomain);
router.get("/:id", getUserById);
router.patch("/:id", updateUserProfile);
router.delete("/:id", deleteUserAccount);

export default router;
