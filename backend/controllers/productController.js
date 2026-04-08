import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/products directory exists inside backend/
const uploadDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all products, optionally filtered by category or search term
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).populate("sellerId", "fullName phone");
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

// Create a new product (handles image upload)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, subcategory, brand, type, location, isFeatured, sellerName, sellerPhone, sellerId } = req.body;
 
     let imageUrl = null;
     if (req.file) {
       imageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
     }
 
     const productData = {
       title, description, price: Number(price), category, subcategory, brand, type,
       location, isFeatured: isFeatured === "true" || isFeatured === true,
       sellerName, sellerPhone,
       ...(imageUrl && { image: imageUrl }),
       ...(sellerId && { sellerId }),
     };

    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerId", "fullName phone");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
};

// Get products sold by a specific seller
export const getSoldProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId, status: "sold" }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching sold products", error: error.message });
  }
};
