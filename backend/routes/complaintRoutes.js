import express from "express";
import multer from "multer";
import { createComplaint, getAllComplaints, updateComplaintStatus } from "../controllers/complaintController.js";

const router = express.Router();

/* ===== MULTER CONFIG ===== */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

/* ===== ROUTES ===== */
router.post("/submit", upload.single("attachment"), createComplaint);
router.get("/all", getAllComplaints);
router.put("/status/:id", updateComplaintStatus);

export default router;
