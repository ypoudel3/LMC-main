import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  keywords: [String],
  category: String,
  language: { type: String, default: "en" },
  confidence: { type: Number, default: 0.8 }
});
const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
