import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Report from "../models/Report.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload folder exists
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload folder at ${uploadDir}`);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/reports
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { anonymousId, category, severity, employer, location, description } = req.body;

    // Validate required fields
    if (!anonymousId || !category || !severity || !employer || !description) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    const files = req.files ? req.files.map(file => file.filename) : [];
    console.log("Received report:", { anonymousId, category, severity, employer, files });

    const newReport = new Report({
      anonymousId,
      category,
      severity,
      employer,
      location,
      description,
      files,
    });

    await newReport.save();
    console.log("Report saved successfully:", newReport._id);

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).json({
      message: "Failed to submit report",
      error: err.message, // detailed error sent for debugging
    });
  }
});

export default router;
