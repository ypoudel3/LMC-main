import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/transactions", auth, getTransactions);
router.post("/transactions", auth, createTransaction);
router.put("/transactions/:id", auth, updateTransaction);
router.delete("/transactions/:id", auth, deleteTransaction);
router.get("/balance", auth, getBalance);

export default router;
