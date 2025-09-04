import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io"; 
import mongoose from "mongoose";
import cors from "cors";;

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {  // <-- match the imported name
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(cors());
app.use(express.json());

// Schemas
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

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  keywords: [String],
  category: String,
  language: { type: String, default: 'en' },
  confidence: { type: Number, default: 0.8 }
});

const feedbackSchema = new mongoose.Schema({
  sessionId: String,
  messageId: String,
  helpful: Boolean,
  userFeedback: String,
  timestamp: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
const FAQ = mongoose.model('FAQ', faqSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Advanced Natural Language Processing
class NLPProcessor {
  constructor() {
    // Intent patterns with regular expressions and keywords
    this.intents = {
      visa_inquiry: {
        patterns: [
          /visa|permit|entry|work\s*visa|employment\s*visa/i,
          /कार्य\s*भिसा|भिसा|प्रवेश/i
        ],
        keywords: ['visa', 'permit', 'entry', 'work permit', 'employment visa', 'भिसा'],
        confidence: 0.9
      },
      documentation: {
        patterns: [
          /document|paper|certificate|attestation|authentication/i,
          /कागजात|प्रमाणपत्र|प्रमाणीकरण/i
        ],
        keywords: ['document', 'certificate', 'paper', 'attestation', 'कागजात'],
        confidence: 0.8
      },
      legal_rights: {
        patterns: [
          /rights?|contract|salary|wage|working\s*hours|overtime|legal|law/i,
          /अधिकार|सम्झौता|तलब|काम|कानुनी/i
        ],
        keywords: ['rights', 'contract', 'salary', 'legal', 'law', 'अधिकार'],
        confidence: 0.9
      },
      emergency_help: {
        patterns: [
          /help|emergency|problem|trouble|stuck|abuse|harassment/i,
          /मद्दत|समस्या|सहायता|अड्चन/i
        ],
        keywords: ['help', 'emergency', 'problem', 'trouble', 'मद्दत', 'समस्या'],
        confidence: 1.0
      },
      agency_verification: {
        patterns: [
          /agency|manpower|recruitment|license|fraud|scam/i,
          /एजेन्सी|म्यानपावर|भर्ती|लाइसेन्स|ठगी/i
        ],
        keywords: ['agency', 'manpower', 'recruitment', 'license', 'एजेन्सी'],
        confidence: 0.85
      },
      cost_information: {
        patterns: [
          /cost|fee|money|expense|price|charge|budget/i,
          /पैसा|खर्च|शुल्क|रकम|लागत/i
        ],
        keywords: ['cost', 'fee', 'money', 'expense', 'price', 'पैसा', 'खर्च'],
        confidence: 0.8
      }
    };

    // Entity extraction patterns
    this.entities = {
      countries: {
        patterns: [
          /(saudi|arabia|uae|emirates|qatar|kuwait|bahrain|oman|malaysia|korea|japan|israel|cyprus|poland|romania)/i,
          /(साउदी|युएई|कतार|कुवैत|बहराइन|ओमान|मलेसिया|कोरिया|जापान)/i
        ],
        type: 'destination_country'
      },
      amounts: {
        patterns: [/(\d+(?:,\d+)*)\s*(rupees?|rs\.?|dollar|usd|\$)/i],
        type: 'money'
      },
      time_periods: {
        patterns: [/(\d+)\s*(days?|weeks?|months?|years?)/i],
        type: 'duration'
      }
    };

    // Dynamic knowledge base that can be updated
    this.knowledgeBase = new Map();
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    // This would typically load from database, but for demo purposes:
    this.knowledgeBase.set('visa_general', {
      content: `For foreign employment from Nepal, you typically need:
• Valid passport (minimum 6 months validity)
• Employment visa from destination country
• Medical fitness certificate
• Police clearance certificate
• Skills/training certificates
• Travel insurance
• Pre-departure orientation certificate`,
      followUp: "Which specific country are you planning to work in? I can provide detailed requirements."
    });

    this.knowledgeBase.set('visa_saudi', {
      content: `For Saudi Arabia employment:
• Iqama (residence permit) processing
• GAMCA medical examination
• Kafeel (sponsor) documentation  
• Embassy attestation of all documents
• Pre-departure training certificate
• Musaned platform registration (for domestic workers)`,
      followUp: "Do you have a confirmed job offer from Saudi Arabia?"
    });

    this.knowledgeBase.set('emergency_abroad', {
      content: `🚨 EMERGENCY CONTACTS:
Nepal Embassy Hotlines:
• UAE: +971-4-397-1356
• Saudi: +966-11-488-2434
• Malaysia: +603-2162-8630
• Qatar: +974-4444-7892

IOM Nepal 24/7 Helpline: +977-1-5900000
Foreign Employment Board: +977-1-4114233

For immediate danger: Contact local police (911/999/100)`,
      followUp: "Are you currently in danger? Should I provide more specific emergency guidance?"
    });
  }

  async processMessage(message, userContext = {}) {
    const result = {
      intent: 'unknown',
      entities: [],
      confidence: 0,
      category: 'general',
      response: '',
      followUp: '',
      needsHumanEscalation: false
    };

    // Clean and normalize message
const cleanMessage = (typeof message === "string" ? message : "").trim().toLowerCase();
    
    // Intent detection
    const detectedIntent = await this.detectIntent(cleanMessage);
    result.intent = detectedIntent.intent;
    result.confidence = detectedIntent.confidence;

    // Entity extraction
    result.entities = this.extractEntities(cleanMessage);

    // Generate contextual response
    const response = await this.generateResponse(detectedIntent, result.entities, userContext, message);
    result.response = response.content;
    result.followUp = response.followUp;
    result.category = detectedIntent.intent;
    result.needsHumanEscalation = response.needsHumanEscalation;

    return result;
  }

  async detectIntent(message) {
    let bestMatch = { intent: 'unknown', confidence: 0 };

    for (const [intentName, intentData] of Object.entries(this.intents)) {
      let confidence = 0;

      // Check regex patterns
      for (const pattern of intentData.patterns) {
        if (pattern.test(message)) {
          confidence = Math.max(confidence, intentData.confidence);
        }
      }

      // Check keyword matching with fuzzy logic
      const keywordScore = this.calculateKeywordScore(message, intentData.keywords);
      confidence = Math.max(confidence, keywordScore);

      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intentName, confidence };
      }
    }

    // If confidence is too low, try semantic similarity (simplified)
    if (bestMatch.confidence < 0.3) {
      const semanticMatch = await this.semanticSimilarity(message);
      if (semanticMatch.confidence > bestMatch.confidence) {
        bestMatch = semanticMatch;
      }
    }

    return bestMatch;
  }

  calculateKeywordScore(message, keywords) {
    let score = 0;
    let matchCount = 0;
    
    for (const keyword of keywords) {
      if (message.includes(keyword.toLowerCase())) {
        matchCount++;
        // Exact match gets higher score
        score += message.split(' ').includes(keyword.toLowerCase()) ? 0.8 : 0.6;
      }
    }
    
    return matchCount > 0 ? Math.min(score / keywords.length, 1.0) : 0;
  }

  async semanticSimilarity(message) {
    // Simple semantic matching - in production, use word embeddings or ML models
    const semanticMappings = {
      'need help': 'emergency_help',
      'documents required': 'documentation', 
      'work abroad': 'visa_inquiry',
      'job contract': 'legal_rights',
      'recruitment company': 'agency_verification',
      'how much cost': 'cost_information'
    };

    for (const [phrase, intent] of Object.entries(semanticMappings)) {
      if (this.calculateSimilarity(message, phrase) > 0.7) {
        return { intent, confidence: 0.7 };
      }
    }

    return { intent: 'unknown', confidence: 0 };
  }

  calculateSimilarity(str1, str2) {
    // Simple Jaccard similarity
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  extractEntities(message) {
    const entities = [];
    
    for (const [entityType, entityData] of Object.entries(this.entities)) {
      for (const pattern of entityData.patterns) {
        const matches = message.match(pattern);
        if (matches) {
          entities.push({
            type: entityData.type,
            value: matches[1] || matches[0],
            confidence: 0.9
          });
        }
      }
    }

    return entities;
  }

  async generateResponse(intent, entities, userContext, originalMessage) {
    let response = { 
      content: '', 
      followUp: '', 
      needsHumanEscalation: false 
    };

    // Check for emergency keywords first
    const safeMessage = (typeof originalMessage === "string" ? originalMessage : "").toLowerCase();

  // Check for emergency keywords first
  if (safeMessage.match(/emergency|urgent|help.*now|danger|abuse|threat/i)) {
    response.needsHumanEscalation = true;
      const emergencyInfo = this.knowledgeBase.get('emergency_abroad');
      response.content = emergencyInfo.content;
      response.followUp = "This seems urgent. I'm also connecting you with a human advisor.";
      return response;
    }

    switch (intent.intent) {
      case 'visa_inquiry':
        response = await this.handleVisaInquiry(entities, userContext);
        break;
      case 'documentation':
        response = await this.handleDocumentationQuery(entities, userContext);
        break;
      case 'legal_rights':
        response = await this.handleLegalRights(entities, userContext);
        break;
      case 'emergency_help':
        const emergencyInfo = this.knowledgeBase.get('emergency_abroad');
        response.content = emergencyInfo.content;
        response.followUp = emergencyInfo.followUp;
        response.needsHumanEscalation = true;
        break;
      case 'agency_verification':
        response = await this.handleAgencyVerification(entities, userContext);
        break;
      case 'cost_information':
        response = await this.handleCostInformation(entities, userContext);
        break;
      default:
        response = await this.handleUnknownQuery(originalMessage, userContext);
    }

    return response;
  }

  async handleVisaInquiry(entities, userContext) {
    // Extract country from entities or context
    const country = entities.find(e => e.type === 'destination_country')?.value || 
                   userContext.destination?.toLowerCase();

    if (country) {
      const countryKey = `visa_${country}`;
      const countryInfo = this.knowledgeBase.get(countryKey);
      
      if (countryInfo) {
        return {
          content: countryInfo.content,
          followUp: countryInfo.followUp
        };
      }
    }

    // Default general visa info
    const generalInfo = this.knowledgeBase.get('visa_general');
    return {
      content: generalInfo.content,
      followUp: generalInfo.followUp
    };
  }

  async handleDocumentationQuery(entities, userContext) {
    return {
      content: `Essential documents for foreign employment:

📋 **Primary Documents:**
• Passport (min 6 months validity)
• Birth certificate
• Citizenship certificate
• Educational certificates
• Skills/training certificates

📋 **Process Documents:**
• Medical fitness certificate
• Police clearance certificate
• Insurance documents
• Employment contract

🏛️ **Attestation Process:**
1. Local notary verification
2. Ministry of Foreign Affairs attestation
3. Destination country embassy attestation

⏱️ **Processing Time:** Usually 2-4 weeks for complete attestation`,
      followUp: "Do you need help with any specific document or the attestation process?"
    };
  }

  async handleLegalRights(entities, userContext) {
    return {
      content: `🛡️ **Your Rights as a Foreign Worker:**

**Contract Rights:**
• Written employment contract in your language
• Clear job description and working hours
• Agreed salary and payment schedule
• Safe working conditions

**Legal Protections:**
• Right to keep your passport
• Right to medical treatment
• Right to rest days and holidays
• Protection from abuse and exploitation

**If Problems Arise:**
• Document everything (photos, recordings if legal)
• Contact Nepal Embassy immediately
• Reach out to IOM Nepal: +977-1-5900000
• Know local labor law hotlines

⚖️ **Remember:** You have the right to leave your job if contract terms are violated.`,
      followUp: "Are you currently facing any specific workplace issues that I can help you address?"
    };
  }

  async handleAgencyVerification(entities, userContext) {
    return {
      content: `🔍 **How to Verify Recruitment Agencies:**

**Licensed Agency Check:**
• Visit: dofe.gov.np (Department of Foreign Employment)
• Search agency by name or license number
• Verify current license status

**Red Flags to Avoid:**
❌ Unlicensed agencies
❌ Excessive fees (>Rs 100,000 for most countries)
❌ No proper receipts
❌ Promises of guaranteed jobs without proper process
❌ Asking for passport to be held

**Maximum Legal Fees:**
• India: Rs 10,000
• Other countries: Rs 100,000 (excluding visa/ticket)

📞 **Report Fraud:** Call 103 (Consumer Rights) or DoFE: +977-1-4114233`,
      followUp: "Do you have a specific agency you'd like me to help you verify?"
    };
  }

  async handleCostInformation(entities, userContext) {
    const amount = entities.find(e => e.type === 'money')?.value;
    
    return {
      content: `💰 **Foreign Employment Cost Breakdown:**

**Mandatory Costs:**
• Service fee: Max Rs 100,000 (Rs 10,000 for India)
• Passport: Rs 5,000 - 15,000
• Medical exam: Rs 3,000 - 8,000
• Skills training: Rs 15,000 - 50,000
• Orientation: Rs 1,500
• Document attestation: Rs 5,000 - 10,000

**Additional Costs:**
• Air ticket: Rs 30,000 - 80,000 (depends on destination)
• Insurance: Rs 2,000 - 5,000
• Visa fees: Varies by country

**⚠️ Important:** 
• Never pay more than legal limits
• Always get proper receipts
• Avoid agencies demanding excessive advance payments

${amount ? `\n**Note:** ${amount} seems ${this.validateAmount(amount)}` : ''}`,
      followUp: "Would you like cost information for a specific country or service?"
    };
  }

  validateAmount(amount) {
    const numAmount = parseInt(amount.replace(/[,\s]/g, ''));
    if (numAmount > 100000) {
      return "⚠️ **higher than legal limits**. Be cautious!";
    } else if (numAmount < 50000) {
      return "✅ within reasonable range for most services.";
    }
    return "📊 in the typical range for foreign employment.";
  }

  async handleUnknownQuery(originalMessage, userContext) {
    // Try to find similar FAQ entries
    const similarFAQ = await this.findSimilarFAQ(originalMessage);
    
    if (similarFAQ) {
      return {
        content: similarFAQ.answer,
        followUp: "Was this helpful? If not, let me know what specific information you're looking for."
      };
    }

    return {
      content: `I understand you're asking about foreign employment, but I need a bit more clarity to provide the best help.

I can assist you with:
🛂 **Visa Requirements** - "What visa do I need for [country]?"
📄 **Documentation** - "What documents are required?"
⚖️ **Legal Rights** - "What are my rights as a worker?"
🏢 **Agency Verification** - "How to check if agency is legitimate?"
💰 **Cost Information** - "How much does it cost to work abroad?"
🚨 **Emergency Help** - "I need immediate assistance"

**या नेपालीमा सोध्नुहोस्** - You can also ask in Nepali!`,
      followUp: "Could you tell me more specifically what you'd like to know about working abroad?"
    };
  }

  async findSimilarFAQ(message) {
    // This would query the FAQ database in a real implementation
    // For now, return null to use default unknown response
    return null;
  }
}

// Initialize NLP processor
const nlpProcessor = new NLPProcessor();

// Enhanced chatbot message processing
export default async function initChat(message, userInfo = {}, sessionId = null) {
  try {
    // Use NLP processor for intelligent response
    const result = await nlpProcessor.processMessage(message, userInfo);
    
    // Log the interaction for learning (in real app, this would train the model)
    console.log(`Intent: ${result.intent}, Confidence: ${result.confidence}, Entities:`, result.entities);
    
    // If human escalation is needed, mark it
    if (result.needsHumanEscalation) {
      // In production, this would trigger human agent notification
      console.log(`Session ${sessionId} needs human escalation`);
    }

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
    console.error('Error processing message:', error);
    return {
      response: "माफ गर्नुहोस्, मलाई त्यो बुझ्न समस्या भयो। कृपया फेरि सोध्नुहोस् वा अर्को तरिकाले भन्नुहोस्। (Sorry, I had trouble understanding that. Please ask again or rephrase.)",
      category: 'error',
      confidence: 0
    };
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join_session', async (sessionId) => {
    socket.join(sessionId);
    
    try {
      const conversation = await Conversation.findOne({ sessionId });
      if (conversation) {
        socket.emit('conversation_history', conversation.messages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  });
  
  socket.on('user_message', async (data) => {
    const { sessionId, message, userInfo } = data;
    
    try {
      // Process message through advanced NLP
      const botResponse = await processUserMessage(message, userInfo, sessionId);
      
      // Save conversation with enhanced metadata
      await Conversation.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: [
              { 
                sender: 'user', 
                message, 
                category: 'user_input',
                timestamp: new Date()
              },
              { 
                sender: 'bot', 
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
      
      // Send enhanced response
      socket.emit('bot_response', {
        message: botResponse.response,
        category: botResponse.category,
        intent: botResponse.intent,
        confidence: botResponse.confidence,
        followUp: botResponse.followUp,
        needsHumanEscalation: botResponse.needsHumanEscalation,
        timestamp: new Date()
      });
      
      // If follow-up question exists, send it after a delay
      if (botResponse.followUp) {
        setTimeout(() => {
          socket.emit('bot_followup', {
            message: botResponse.followUp,
            timestamp: new Date()
          });
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('bot_response', {
        message: 'माफ गर्नुहोस्, त्यहाँ एक प्राविधिक समस्या छ। कृपया फेरि प्रयास गर्नुहोस्। (Sorry, there was a technical issue. Please try again.)',
        category: 'error'
      });
    }
  });

  // Handle feedback for continuous learning
  socket.on('feedback', async (data) => {
    const { sessionId, messageId, helpful, userFeedback } = data;
    
    try {
      await Feedback.create({
        sessionId,
        messageId,
        helpful,
        userFeedback
      });
      
      console.log(`Feedback received for session ${sessionId}: ${helpful ? 'helpful' : 'not helpful'}`);
      
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API endpoints for analytics and management
app.get('/api/analytics/intents', async (req, res) => {
  try {
    const intentStats = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.intent': { $exists: true } } },
      { $group: { _id: '$messages.intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(intentStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conversations/:sessionId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ sessionId: req.params.sessionId });
    res.json(conversation || { messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new FAQ endpoint for continuous learning
app.post('/api/faq', async (req, res) => {
  try {
    const { question, answer, category, keywords } = req.body;
    const faq = new FAQ({ question, answer, category, keywords });
    await faq.save();
    res.json({ message: 'FAQ added successfully', id: faq._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Advanced Nepali Migration Chatbot Server running on port ${PORT}`);
  console.log('🧠 NLP processor initialized with intelligent response generation');
  console.log('📊 Analytics and learning endpoints available');
});