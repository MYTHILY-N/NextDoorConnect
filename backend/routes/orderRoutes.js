import express from "express";
import { placeOrder, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/user/:userId", getMyOrders);

export default router;
