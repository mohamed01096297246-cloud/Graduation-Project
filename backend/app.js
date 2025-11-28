const express = require("express");
const cors = require("cors");
require("dotenv").config();
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("EduLink Backend API is running...");
});

module.exports = app;

