
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import analysis routes
const analyzeRoutes = require("./routes/analyzeRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("AI Phishing Detection Backend is Running!");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Phishing Detection API is working!"
  });
});

// Connect analysis routes
app.use("/api", analyzeRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log("------------------------------------");
  console.log("PhishGuard AI Backend Started");
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Groq API Key Loaded:", Boolean(process.env.GROQ_API_KEY));
  console.log("------------------------------------");
});

// Detect server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Detect server closure
server.on("close", () => {
  console.log("Server has closed.");
});

// Detect Node.js process exit
process.on("exit", (code) => {
  console.log("Node process exited with code:", code);
});

// Detect unexpected process errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});
