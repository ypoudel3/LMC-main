import Conversation from "../models/Conversation.js";

export const getIntentAnalytics = async (req, res) => {
  try {
    const intentStats = await Conversation.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.intent": { $exists: true } } },
      { $group: { _id: "$messages.intent", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(intentStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversationBySession = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ sessionId: req.params.sessionId });
    res.json(conversation || { messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
