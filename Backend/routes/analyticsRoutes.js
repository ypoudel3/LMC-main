import express from "express";
import { getIntentAnalytics, getConversationBySession } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/intents", getIntentAnalytics);
router.get("/conversations/:sessionId", getConversationBySession);

export default router;
