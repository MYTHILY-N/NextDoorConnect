import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
    try {
        const {
            userId,
            providerId,
            userName,
            userPhone,
            userAddress,
            serviceCategory,
            description,
            isEmergency,
            paymentMethod,
            paidOnline
        } = req.body;

        const newBooking = new Booking({
            userId,
            providerId,
            userName,
            userPhone,
            userAddress,
            serviceCategory,
            description,
            isEmergency,
            paymentMethod,
            paidOnline
        });

        await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking requested successfully",
            booking: newBooking
        });
    } catch (error) {
        console.error("❌ Create Booking Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProviderBookings = async (req, res) => {
    try {
        const { providerId } = req.params;
        const bookings = await Booking.find({ providerId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error("❌ Get Provider Bookings Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            booking
        });
    } catch (error) {
        console.error("❌ Update Booking Status Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId })
            .populate("providerId", "fullName email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error("❌ Get User Bookings Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

