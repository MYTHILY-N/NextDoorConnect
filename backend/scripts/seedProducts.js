import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const mockProducts = [
  {
    title: "Honda City 2020",
    description: "Excellent condition, first owner, full service history.",
    price: 850000,
    category: "Cars",
    image: "https://via.placeholder.com/400x300?text=Honda+City",
    location: "City Center",
    year: "2020",
    usage: "45,000 km",
    isFeatured: true
  },
  {
    title: "Yamaha R15 V3",
    description: "Well maintained sport bike. Insured till 2024.",
    price: 120000,
    category: "Bikes",
    image: "https://via.placeholder.com/400x300?text=Yamaha+R15",
    location: "North Suburb",
    year: "2019",
    usage: "22,000 km",
    isFeatured: false
  },
  {
    title: "2 BHK Flat in Greenfield",
    description: "Spacious 2 BHK on the 5th floor with a park view.",
    price: 4500000,
    category: "Properties",
    image: "https://via.placeholder.com/400x300?text=2+BHK+Flat",
    location: "Greenfield Heights",
    year: "2015",
    isFeatured: true
  },
  {
    title: "iPhone 13 Pro 128GB",
    description: "Like new, battery health 88%, with original box.",
    price: 52000,
    category: "Mobiles",
    image: "https://via.placeholder.com/400x300?text=iPhone+13+Pro",
    location: "West End",
    year: "2021",
    usage: "Used 2 Years",
    isFeatured: false
  },
  {
    title: "Wooden Dining Table",
    description: "Custom built 6-seater dining table with chairs.",
    price: 15000,
    category: "Furniture",
    image: "https://via.placeholder.com/400x300?text=Dining+Table",
    location: "South Town",
    usage: "Like New",
    isFeatured: true
  },
  {
    title: "LG Washing Machine 7kg",
    description: "Fully automatic top load washing machine. Working perfectly.",
    price: 8000,
    category: "Electronics & Appliances",
    image: "https://via.placeholder.com/400x300?text=LG+Washing+Machine",
    location: "Central Avenue",
    year: "2018",
    usage: "Used 4 Years",
    isFeatured: false
  }
];

const seedProducts = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.log("Database connection failed. Aborting.");
      process.exit(1);
    }
    await Product.deleteMany();
    await Product.insertMany(mockProducts);
    console.log("Products seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

seedProducts();
