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
      enum: ["user", "provider","admin"],
      required: true,
    },

    addressProof: {
      type: String, // file path
      required: true,
    },

    serviceDoc: {
      type: String, // optional
    },

    isVerified: {
      type: Boolean,
      default: false, // admin verification
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
