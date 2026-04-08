import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
    },
    brand: {
      type: String,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Product+Image",
    },
    location: {
      type: String,
      required: true,
      default: "Local Area",
    },
    year: {
      type: String,
    },
    usage: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sellerName: {
      type: String,
    },
    sellerPhone: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    rentedUntil: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      enum: ["sell", "rent"],
      default: "sell",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
