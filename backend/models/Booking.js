import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    serviceCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    isEmergency: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    paidOnline: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Completed"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
