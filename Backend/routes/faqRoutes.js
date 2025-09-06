import express from "express";
import { addFAQ } from "../controllers/faqController.js";

const router = express.Router();

router.post("/", addFAQ);

export default router;
