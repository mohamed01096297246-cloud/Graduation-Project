const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const studentRoutes = require("./src/routes/studentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");  
  

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);        
          

// Test route
app.get("/", (req, res) => {
  res.send("EduLink Backend API is running...");
});

module.exports = app;
