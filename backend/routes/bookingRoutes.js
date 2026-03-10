import express from "express";
import { createBooking, getProviderBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/provider/:providerId", getProviderBookings);
router.patch("/:bookingId/status", updateBookingStatus);

export default router;
