// NLP processor class and initChat
class NLPProcessor {
  constructor() {
    // intents, entities, knowledgeBase ...
  }

  // all methods: loadKnowledgeBase, processMessage, detectIntent, etc.
}

// Initialize NLP processor
const nlpProcessor = new NLPProcessor();

export default async function initChat(message, userInfo = {}, sessionId = null) {
  try {
    const result = await nlpProcessor.processMessage(message, userInfo);
    return {
      response: result.response,
      category: result.category,
      intent: result.intent,
      entities: result.entities,
      confidence: result.confidence,
      followUp: result.followUp,
      needsHumanEscalation: result.needsHumanEscalation
    };
  } catch (error) {
    console.error("Error processing message:", error);
    return {
      response:
        "माफ गर्नुहोस्, मलाई त्यो बुझ्न समस्या भयो। कृपया फेरि सोध्नुहोस् वा अर्को तरिकाले भन्नुहोस्। (Sorry, I had trouble understanding that. Please ask again or rephrase.)",
      category: "error",
      confidence: 0,
    };
  }
}
