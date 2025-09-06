import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  sessionId: String,
  messages: [{
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    category: String,
    intent: String,
    entities: [String]
  }],
  userInfo: {
    name: String,
    destination: String,
    currentStatus: String,
    userProfile: Object
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conversation", conversationSchema);
