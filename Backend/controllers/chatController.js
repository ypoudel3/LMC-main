import Conversation from "../models/Conversation.js";
import initChat from "../nlp/initChat.js";
import Feedback from "../models/Feedback.js";

// Process user message
export const processUserMessage = async (sessionId, message, userInfo) => {
  const botResponse = await initChat(message, userInfo, sessionId);

  await Conversation.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        messages: [
          { sender: "user", message, category: "user_input", timestamp: new Date() },
          {
            sender: "bot",
            message: botResponse.response,
            category: botResponse.category,
            intent: botResponse.intent,
            entities: botResponse.entities,
            timestamp: new Date()
          }
        ]
      },
      userInfo: userInfo || {}
    },
    { upsert: true }
  );

  return botResponse;
};

// Save feedback
export const saveFeedback = async (sessionId, messageId, helpful, userFeedback) => {
  return await Feedback.create({ sessionId, messageId, helpful, userFeedback });
};
