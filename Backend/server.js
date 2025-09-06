import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketIO } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import sosRoutes from "./routes/sos.js";
import expenseRouter from "./expense.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import reportRoutes from "./routes/reports.js"; // our new route
import chatRoutes from "./routes/chatRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import { processUserMessage, saveFeedback } from "./controllers/chatController.js";
// Setup
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const io = new SocketIO(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// Database connection
connectDB();


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
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/faq", faqRoutes);


// Error handler
app.use(errorHandler);

// Fallback to frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});
// Health check
app.get("/", (req, res) => res.send("Server is running"));

// Socket.IO events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_session", async (sessionId) => {
    socket.join(sessionId);
    // load past conversation if needed
  });

  socket.on("user_message", async ({ sessionId, message, userInfo }) => {
    try {
      const botResponse = await processUserMessage(sessionId, message, userInfo);
      socket.emit("bot_response", { ...botResponse, timestamp: new Date() });
    } catch (error) {
      socket.emit("bot_response", { message: "Error occurred", category: "error" });
    }
  });

  socket.on("feedback", async (data) => {
    await saveFeedback(data.sessionId, data.messageId, data.helpful, data.userFeedback);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
