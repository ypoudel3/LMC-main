import express from "express";
import { processUserMessage, saveFeedback } from "../controllers/chatController.js";

const router = express.Router();

// Example API endpoints for chat (Socket.io handles real-time separately)
router.post("/message", async (req, res) => {
  const { sessionId, message, userInfo } = req.body;
  const botResponse = await processUserMessage(sessionId, message, userInfo);
  res.json(botResponse);
});

router.post("/feedback", async (req, res) => {
  const { sessionId, messageId, helpful, userFeedback } = req.body;
  const feedback = await saveFeedback(sessionId, messageId, helpful, userFeedback);
  res.json(feedback);
});

export default router;
