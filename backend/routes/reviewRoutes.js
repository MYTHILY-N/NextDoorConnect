import express from "express";
import { addReview, getProviderReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", addReview);
router.get("/:providerId", getProviderReviews);

export default router;
