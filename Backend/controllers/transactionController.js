import Transaction from "../models/Transactions.js";

// Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const transaction = new Transaction({
      type,
      amount,
      description,
      category,
      date,
      user: req.user._id, // attach logged-in user
      userDetails: {
        username: req.user.username,
        email: req.user.email
      }
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    Object.assign(transaction, req.body);
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get balance
export const getBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({ totalIncome, totalExpense, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
