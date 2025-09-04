import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// -----------------------------
// Transaction Schema
// -----------------------------
const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

// -----------------------------
// Routes
// -----------------------------
const expenseRouter = express.Router();

// Get all transactions
expenseRouter.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
expenseRouter.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new transaction
expenseRouter.post("/transactions", async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const transaction = new Transaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: date ? new Date(date) : new Date(),
    });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update transaction
expenseRouter.put("/transactions/:id", async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: date ? new Date(date) : new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
expenseRouter.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance summary
expenseRouter.get("/balance", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unique categories
expenseRouter.get("/categories", async (req, res) => {
  try {
    const categories = await Transaction.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default expenseRouter;
