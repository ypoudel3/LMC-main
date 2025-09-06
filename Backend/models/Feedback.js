import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  sessionId: String,
  messageId: String,
  helpful: Boolean,
  userFeedback: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", feedbackSchema, "feedbacks");
