import express from "express";
import { createBooking, getProviderBookings, updateBookingStatus, getUserBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/provider/:providerId", getProviderBookings);
router.get("/user/:userId", getUserBookings);
router.patch("/:bookingId/status", updateBookingStatus);

export default router;
