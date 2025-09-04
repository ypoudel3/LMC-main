import express from "express";
import { sendSOS } from "../controllers/sosController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-sos", auth, sendSOS);

export default router;
