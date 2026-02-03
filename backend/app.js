const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

const adminRoutes = require("./src/routes/adminRoutes");

const studentRoutes = require("./src/routes/studentRoutes");

const attendanceRoutes = require("./src/routes/attendanceRoutes");

const behaviorRoutes = require("./src/routes/behaviorRoutes");

const homeworkRoutes = require("./src/routes/homeworkRoutes");

const timetableRoutes = require("./src/routes/timetableRoutes");

const notificationRoutes = require("./src/routes/notificationRoutes");

const examRoutes = require("./src/routes/examRoutes");

const resultRoutes = require("./src/routes/resultRoutes");

const homeworkResultRoutes = require("./src/routes/homeworkResultRoutes");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/behavior", behaviorRoutes);

app.use("/api/homework", homeworkRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/homework-results", homeworkResultRoutes);

app.get("/", (req, res) => {
  res.send("EduLink Backend API is running...");
});

module.exports = app;
