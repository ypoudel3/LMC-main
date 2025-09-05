import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import sosRoutes from "./routes/sos.js";
import expenseRouter from "./expense.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import reportRoutes from "./routes/reports.js"; // our new route

// Setup
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
connectDB();

// Import chat module
import initChat from "./chat.js";
initChat(server); // attach socket.io to the same server

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

// Serve frontend build
app.use(express.static(path.join(__dirname, "../Frontend/dist")));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api", sosRoutes);
app.use("/api", expenseRouter);
app.use("/api/reports", reportRoutes);

// Error handler
app.use(errorHandler);

// Fallback to frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});
// Health check
app.get("/", (req, res) => res.send("Server is running"));
// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
