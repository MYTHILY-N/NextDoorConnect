import express from "express";
import { getProducts, createProduct, getProductById, upload, getSoldProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);
router.get("/sold/:sellerId", getSoldProducts);

export default router;
