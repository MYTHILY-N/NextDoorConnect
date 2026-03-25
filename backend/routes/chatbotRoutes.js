import express from "express";
import { processChatMessage } from "../controllers/chatbotController.js";

const router = express.Router();

// POST endpoint to send message to chatbot
router.post("/", processChatMessage);

export default router;
