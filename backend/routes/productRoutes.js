import express from "express";
import { getProducts, createProduct, getProductById, upload } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);

export default router;
