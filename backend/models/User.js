import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },

    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    addressProof: {
      type: String, // file path
      required: true,
    },

    serviceDoc: {
      type: String, // optional
    },

    serviceDomain: {
      type: String, // e.g., "plumbing", "electrical"
      default: null,
    },

    serviceDescription: {
      type: String, // detailed description of service
      default: null,
    },

    hourlyRate: {
      type: String, // e.g., "₹500/hr"
      default: "N/A",
    },

    availableTime: {
      type: String, // e.g., "9 AM - 6 PM"
      default: "N/A",
    },

    rating: {
      type: Number,
      default: 5.0,
    },

    isVerified: {
      type: Boolean,
      default: false, // admin verification
    },
    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
