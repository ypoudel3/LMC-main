import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Bot, Globe, FileText, Shield, Phone, ThumbsUp, ThumbsDown, AlertTriangle, Brain } from 'lucide-react';

const Legal = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    destination: '',
    currentStatus: 'planning'
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  // Advanced NLP simulation for dynamic responses
  const nlpProcessor = {
    intents: {
      visa_inquiry: {
        patterns: [/visa|permit|entry|work\s*visa|employment\s*visa/i, /कार्य\s*भिसा|भिसा|प्रवेश/i],
        keywords: ['visa', 'permit', 'entry', 'work permit', 'employment visa', 'भिसा']
      },
      documentation: {
        patterns: [/document|paper|certificate|attestation|authentication/i, /कागजात|प्रमाणपत्र|प्रमाणीकरण/i],
        keywords: ['document', 'certificate', 'paper', 'attestation', 'कागजात']
      },
      legal_rights: {
        patterns: [/rights?|contract|salary|wage|working\s*hours|overtime|legal|law/i, /अधिकार|सम्झौता|तलब|काम|कानुनी/i],
        keywords: ['rights', 'contract', 'salary', 'legal', 'law', 'अधिकार']
      },
      emergency_help: {
        patterns: [/help|emergency|problem|trouble|stuck|abuse|harassment/i, /मद्दत|समस्या|सहायता|अड्चन/i],
        keywords: ['help', 'emergency', 'problem', 'trouble', 'मद्दत', 'समस्या']
      },
      agency_verification: {
        patterns: [/agency|manpower|recruitment|license|fraud|scam/i, /एजेन्सी|म्यानपावर|भर्ती|लाइसेन्स|ठगी/i],
        keywords: ['agency', 'manpower', 'recruitment', 'license', 'एजेन्सी']
      },
      cost_information: {
        patterns: [/cost|fee|money|expense|price|charge|budget/i, /पैसा|खर्च|शुल्क|रकम|लागत/i],
        keywords: ['cost', 'fee', 'money', 'expense', 'price', 'पैसा', 'खर्च']
      }
    },

    knowledgeBase: {
      visa_general: `For foreign employment from Nepal, you typically need:
• Valid passport (minimum 6 months validity)
• Employment visa from destination country
• Medical fitness certificate
• Police clearance certificate
• Skills/training certificates
• Travel insurance
• Pre-departure orientation certificate`,

      visa_saudi: `For Saudi Arabia employment:
• Iqama (residence permit) processing
• GAMCA medical examination
• Kafeel (sponsor) documentation  
• Embassy attestation of all documents
• Pre-departure training certificate
• Musaned platform registration (for domestic workers)`,

      visa_malaysia: `For Malaysia employment:
• FOMEMA medical test (mandatory)
• VDR (Visa with Reference) approval
• Security clearance certificate
• Skills verification certificate
• Embassy attestation of educational documents
• Pre-departure briefing completion`,

      emergency_contacts: `🚨 EMERGENCY CONTACTS:
Nepal Embassy Hotlines:
• UAE: +971-4-397-1356
• Saudi: +966-11-488-2434  
• Malaysia: +603-2162-8630
• Qatar: +974-4444-7892

IOM Nepal 24/7 Helpline: +977-1-5900000
Foreign Employment Board: +977-1-4114233

For immediate danger: Contact local police (911/999/100)`,

      legal_rights: `🛡️ Your Rights as a Foreign Worker:

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
• Know local labor law hotlines`,

      agency_verification: `🔍 How to Verify Recruitment Agencies:

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

📞 Report Fraud: Call 103 (Consumer Rights) or DoFE: +977-1-4114233`,

      cost_breakdown: `💰 Foreign Employment Cost Breakdown:

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

⚠️ Important: 
• Never pay more than legal limits
• Always get proper receipts
• Avoid agencies demanding excessive advance payments`
    },

    // Advanced intent detection with confidence scoring
    detectIntent: function(message) {
      const lowerMessage = message.toLowerCase();
      let bestMatch = { intent: 'unknown', confidence: 0, entities: [] };

      // Check each intent
      for (const [intentName, intentData] of Object.entries(this.intents)) {
        let confidence = 0;

        // Pattern matching
        for (const pattern of intentData.patterns) {
          if (pattern.test(lowerMessage)) {
            confidence = Math.max(confidence, 0.9);
          }
        }

        // Keyword matching with scoring
        let keywordMatches = 0;
        for (const keyword of intentData.keywords) {
          if (lowerMessage.includes(keyword.toLowerCase())) {
            keywordMatches++;
            confidence = Math.max(confidence, 0.6 + (keywordMatches * 0.1));
          }
        }

        if (confidence > bestMatch.confidence) {
          bestMatch = { intent: intentName, confidence, entities: this.extractEntities(lowerMessage) };
        }
      }

      // Semantic similarity for unknown intents
      if (bestMatch.confidence < 0.4) {
        const semanticMatch = this.checkSemanticSimilarity(lowerMessage);
        if (semanticMatch.confidence > bestMatch.confidence) {
          bestMatch = semanticMatch;
        }
      }

      return bestMatch;
    },

    // Extract entities like countries, amounts, time periods
    extractEntities: function(message) {
      const entities = [];
      
      // Country detection
      const countries = {
        'saudi': 'Saudi Arabia', 'arabia': 'Saudi Arabia', 'saudi arabia': 'Saudi Arabia',
        'uae': 'UAE', 'emirates': 'UAE', 'dubai': 'UAE', 'abu dhabi': 'UAE',
        'qatar': 'Qatar', 'doha': 'Qatar',
        'kuwait': 'Kuwait', 'bahrain': 'Bahrain', 'oman': 'Oman',
        'malaysia': 'Malaysia', 'kuala lumpur': 'Malaysia',
        'korea': 'South Korea', 'south korea': 'South Korea',
        'japan': 'Japan', 'israel': 'Israel', 'cyprus': 'Cyprus'
      };

      for (const [key, value] of Object.entries(countries)) {
        if (message.includes(key)) {
          entities.push({ type: 'country', value: value, confidence: 0.9 });
          break;
        }
      }

      // Amount detection
      const amountMatch = message.match(/(\d+(?:,\d+)*)\s*(rupees?|rs\.?|dollars?|\$)/i);
      if (amountMatch) {
        entities.push({ type: 'amount', value: amountMatch[1], currency: amountMatch[2], confidence: 0.8 });
      }

      // Time detection
      const timeMatch = message.match(/(\d+)\s*(days?|weeks?|months?|years?)/i);
      if (timeMatch) {
        entities.push({ type: 'time_period', value: timeMatch[1], unit: timeMatch[2], confidence: 0.8 });
      }

      return entities;
    },

    checkSemanticSimilarity: function(message) {
      const semanticMappings = {
        'need help': 'emergency_help',
        'documents required': 'documentation', 
        'work abroad': 'visa_inquiry',
        'job contract': 'legal_rights',
        'recruitment company': 'agency_verification',
        'how much cost': 'cost_information',
        'money needed': 'cost_information',
        'worker protection': 'legal_rights',
        'embassy contact': 'emergency_help'
      };

      for (const [phrase, intent] of Object.entries(semanticMappings)) {
        if (this.calculateSimilarity(message, phrase) > 0.6) {
          return { intent, confidence: 0.7, entities: this.extractEntities(message) };
        }
      }

      return { intent: 'unknown', confidence: 0, entities: [] };
    },

    calculateSimilarity: function(str1, str2) {
      const set1 = new Set(str1.split(' '));
      const set2 = new Set(str2.split(' '));
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      return intersection.size / union.size;
    },

    // Generate intelligent responses based on intent and entities
    generateResponse: function(intent, entities, userMessage) {
      const response = { 
        message: '', 
        category: intent.intent, 
        confidence: intent.confidence,
        followUp: '',
        needsHumanEscalation: false,
        suggestions: []
      };

      // Check for emergency keywords
      if (userMessage.match(/emergency|urgent|help.*now|danger|abuse|threat|stuck|trapped/i)) {
        response.needsHumanEscalation = true;
        response.message = this.knowledgeBase.emergency_contacts + "\n\n🚨 This seems urgent. Please contact the appropriate emergency number immediately.";
        response.followUp = "Are you in immediate danger? If yes, contact local emergency services right away.";
        return response;
      }

      switch (intent.intent) {
        case 'visa_inquiry':
          const country = entities.find(e => e.type === 'country')?.value;
          if (country) {
            const countryKey = `visa_${country.toLowerCase().replace(' ', '_')}`;
            response.message = this.knowledgeBase[countryKey] || this.knowledgeBase.visa_general;
            response.followUp = `Do you have any specific questions about ${country} visa requirements?`;
            response.suggestions = ['Document requirements', 'Processing time', 'Costs involved'];
          } else {
            response.message = this.knowledgeBase.visa_general;
            response.followUp = "Which country are you planning to work in? I can provide specific requirements.";
            response.suggestions = ['Saudi Arabia', 'Malaysia', 'UAE', 'Qatar', 'Korea'];
          }
          break;

        case 'documentation':
          response.message = `📋 **Essential Documents for Foreign Employment:**

**Primary Documents:**
• Passport (min 6 months validity)
• Birth certificate  
• Citizenship certificate
• Educational certificates
• Skills/training certificates

**Process Documents:**
• Medical fitness certificate
• Police clearance certificate
• Insurance documents
• Employment contract

🏛️ **Attestation Process:**
1. Local notary verification
2. Ministry of Foreign Affairs attestation  
3. Destination country embassy attestation

⏱️ **Processing Time:** Usually 2-4 weeks for complete attestation`;
          response.followUp = "Do you need help with any specific document or the attestation process?";
          response.suggestions = ['Attestation process', 'Medical certificate', 'Police clearance'];
          break;

        case 'legal_rights':
          response.message = this.knowledgeBase.legal_rights;
          response.followUp = "Are you currently facing any specific workplace issues that I can help you address?";
          response.suggestions = ['Contract problems', 'Salary issues', 'Working conditions', 'Emergency contacts'];
          break;

        case 'emergency_help':
          response.message = this.knowledgeBase.emergency_contacts;
          response.followUp = "What type of problem are you facing? I can provide more specific guidance.";
          response.needsHumanEscalation = true;
          response.suggestions = ['Legal issues', 'Workplace abuse', 'Document problems', 'Health emergency'];
          break;

        case 'agency_verification':
          response.message = this.knowledgeBase.agency_verification;
          response.followUp = "Do you have a specific agency name you'd like me to help you verify?";
          response.suggestions = ['Check agency license', 'Report fraud', 'Fee verification', 'Red flags'];
          break;

        case 'cost_information':
          const amount = entities.find(e => e.type === 'amount')?.value;
          response.message = this.knowledgeBase.cost_breakdown;
          if (amount) {
            const numAmount = parseInt(amount.replace(/,/g, ''));
            if (numAmount > 100000) {
              response.message += `\n\n⚠️ **Warning:** ${amount} is above the legal limit of Rs 100,000. This could be a scam!`;
            } else {
              response.message += `\n\n✅ ${amount} is within reasonable limits for most services.`;
            }
          }
          response.followUp = "Would you like cost information for a specific country or service?";
          response.suggestions = ['Saudi Arabia costs', 'Malaysia costs', 'UAE costs', 'Document fees'];
          break;

        default:
          response.message = `I understand you're asking about foreign employment, but I need a bit more clarity to provide the best help.

I can assist you with:
🛂 **Visa Requirements** - "What visa do I need for Saudi Arabia?"
📄 **Documentation** - "What documents are required?"
⚖️ **Legal Rights** - "What are my rights as a worker?"
🏢 **Agency Verification** - "How to check if agency is legitimate?"
💰 **Cost Information** - "How much does it cost to work abroad?"
🚨 **Emergency Help** - "I need immediate assistance"

**या नेपालीमा सोध्नुहोस्** - You can also ask in Nepali!`;
          response.followUp = "Could you tell me more specifically what you'd like to know about working abroad?";
          response.suggestions = ['Visa requirements', 'Document help', 'Worker rights', 'Agency check', 'Cost breakdown'];
      }

      return response;
    }
  };

  // Simulate connection
  useEffect(() => {
    setIsConnected(true);
    
    // Add welcome message
    setMessages([{
      id: 1,
      sender: 'bot',
      message: "नमस्ते! Welcome to Nepal Foreign Employment Legal Assistant। म तपाईंको वैदेशिक रोजगारी र कानुनी सहायताका लागि यहाँ छु।\n\nI use advanced AI to understand your questions and provide personalized legal guidance for:\n• Visa requirements and procedures\n• Legal documentation and attestation\n• Worker rights and contracts\n• Recruitment agency verification\n• Country-specific information\n• Cost breakdown and fees\n\n🧠 **Smart Features:** I can understand context, detect your intent, and provide follow-up suggestions based on your specific needs.\n\nPlease ask me anything about foreign employment!",
      timestamp: new Date(),
      category: 'greeting',
      confidence: 1.0,
      suggestions: ['Visa requirements', 'Document help', 'Worker rights', 'Emergency contacts']
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Intelligent bot response processing
  const processUserMessage = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      // Use NLP processor for intelligent response
      const intentAnalysis = nlpProcessor.detectIntent(userMessage);
      const response = nlpProcessor.generateResponse(intentAnalysis, intentAnalysis.entities, userMessage);
      
      const botMessage = {
        id: Date.now(),
        sender: 'bot',
        message: response.message,
        timestamp: new Date(),
        category: response.category,
        confidence: response.confidence,
        intent: intentAnalysis.intent,
        entities: intentAnalysis.entities,
        needsHumanEscalation: response.needsHumanEscalation,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Send follow-up if available
      if (response.followUp) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            message: response.followUp,
            timestamp: new Date(),
            category: 'followup',
            isFollowUp: true
          }]);
        }, 2000);
      }

    }, Math.random() * 1000 + 1000); // Simulate thinking time
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date(),
      category: 'user_input'
    };
    
    setMessages(prev => [...prev, userMessage]);
    processUserMessage(inputMessage);
    setInputMessage('');
    setShowWelcome(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  const handleFeedback = (messageId, helpful) => {
    console.log(`Feedback for message ${messageId}: ${helpful ? 'helpful' : 'not helpful'}`);
    // In real app, this would send feedback to backend for learning
  };

  const quickActions = [
    { label: 'Visa Requirements', icon: Globe, message: 'What are the visa requirements for working abroad?' },
    { label: 'Document Help', icon: FileText, message: 'What documents do I need for foreign employment?' },
    { label: 'Worker Rights', icon: Shield, message: 'What are my rights as a foreign worker?' },
    { label: 'Emergency Help', icon: Phone, message: 'I need emergency help and contacts' }
  ];

  const CategoryIcon = ({ category }) => {
    const icons = {
      greeting: MessageCircle,
      visa_inquiry: Globe,
      documentation: FileText,
      legal_rights: Shield,
      agency_verification: User,
      cost_information: User,
      emergency_help: AlertTriangle,
      followup: Brain,
      general: MessageCircle,
      user_input: User
    };
    
    const IconComponent = icons[category] || MessageCircle;
    return <IconComponent size={16} />;
  };

  return (
    <>
    {/* Navbar */}
        <div className="fixed top-0 z-50 w-full flex flex-row justify-between pt-3 pb-3 px-7 md:px-12 bg-black/90 brightness-90">
          <div className="text-white flex flex-row items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <div>L-MCM</div>
          </div>

          <div className="flex justify-center">
            <ul className="flex gap-6 text-white">
              <li>Home</li>
        <a href="/legal" target="_self">Legal Help</a>
              <li>Track Expenses</li>
              <li>Report Abuse</li>
            </ul>
          </div>

          <div className="text-white">
            <i
              className="fa-regular fa-user cursor-pointer"
              onClick={() => setIsOpen(true)}
            ></i>
          </div>
        </div>

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-red-500">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className='pt-10'>
                <h1 className="text-xl font-bold text-gray-800">Nepal Foreign Employment AI Assistant</h1>
                <p className="text-sm text-gray-600">AI-Powered Legal Guidance | वैदेशिक रोजगारी कानुनी सहायक</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-10">
              <div className="flex items-center space-x-2">
                <Brain size={16} className="text-purple-600" />
                <span className="text-xs text-purple-600">Smart NLP</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {showWelcome && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-base text-gray-600 mr-2">Quick help:</span>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(action.message);
                    setShowWelcome(false);
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-sm text-blue-800 transition-colors"
                >
                  <action.icon size={14} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.isFollowUp 
                      ? 'bg-purple-500 text-white'
                      : 'bg-green-500 text-white'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : message.isFollowUp ? <Brain size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${
                  message.sender === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : message.isFollowUp
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 rounded-bl-none'
                        : 'bg-white text-gray-800 border rounded-bl-none shadow-sm'
                  }`}>
                    {message.sender === 'bot' && !message.isFollowUp && (
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon category={message.category} />
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {message.intent || message.category?.replace('_', ' ')}
                          </span>
                        </div>
                        {message.confidence && (
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              message.confidence > 0.8 ? 'bg-green-500' : 
                              message.confidence > 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="text-xs text-gray-400">
                              {Math.round(message.confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {message.message}
                    </p>
                    
                    {message.needsHumanEscalation && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        🚨 This message has been flagged for human review due to urgency.
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-1 flex items-center justify-between ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <span>
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                    
                    {message.sender === 'bot' && !message.isFollowUp && (
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleFeedback(message.id, true)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Helpful"
                        >
                          <ThumbsUp size={12} className="text-gray-400 hover:text-green-500" />
                        </button>
                        <button 
                          onClick={() => handleFeedback(message.id, false)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Not helpful"
                        >
                          <ThumbsDown size={12} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className={`flex flex-wrap gap-2 mt-2 ${
                  message.sender === 'user' ? 'justify-end' : 'ml-11'
                }`}>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white border rounded-2xl rounded-bl-none shadow-sm px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Brain size={16} className="text-purple-500 animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative flex flex-row gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your query... (Type in English or नेपाली)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 text-sm"
                  rows="1"
                  style={{ minHeight: '48px' }}
                />
                <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="flex-shrink-0 w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Send size={20} />
            </button>
              </div>
            </div>
            
            
          </div>
          
    
        </div>
      </div>
    
    </>
  );
};

export default Legal;