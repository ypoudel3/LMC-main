import FAQ from "../models/FAQ.js";

export const addFAQ = async (req, res) => {
  try {
    const { question, answer, category, keywords } = req.body;
    const faq = new FAQ({ question, answer, category, keywords });
    await faq.save();
    res.json({ message: "FAQ added successfully", id: faq._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
