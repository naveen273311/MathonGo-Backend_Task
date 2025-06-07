const express = require("express");
const dotenv = require("dotenv");
const chapterRoutes = require("./routes/chapterRoutes");
const limiter = require("./middlewares/rateLimiter");

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Rate limiter applied to chapter routes
app.use("/api/v1/chapters", limiter, chapterRoutes);

// Test route to check server is working
app.get("/", (req, res) => {
  res.send("API is running");
});

// Fallback for 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
