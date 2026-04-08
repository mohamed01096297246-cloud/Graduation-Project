const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

// استيراد الميدل وير الخاص بالأخطاء (اختياري لو حابب تفصله)
const app = express();

// ================= 🔐 SECURITY & MIDDLEWARES =================

app.use(helmet()); // لتأمين الـ HTTP Headers
app.use(cors()); // للسماح للـ Frontend بالاتصال بالسيرفر
app.use(compression()); // لضغط البيانات وتسريع الاستجابة
app.use(express.json()); // لتحليل بيانات الـ JSON في الـ Request Body

// 📌 Logger لمتابعة الطلبات أثناء البرمجة
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ================= 📂 IMPORT ROUTES =================

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const parentRoutes = require("./src/routes/parentRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const classroomRoutes = require("./src/routes/classroomRoutes"); // تم توحيد الاسم هنا
const subjectRoutes = require("./src/routes/subjectRoutes");
const scheduleRoutes = require("./src/routes/scheduleRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const behaviorRoutes = require("./src/routes/behaviorRoutes");
const homeworkRoutes = require("./src/routes/homeworkRoutes");
const examRoutes = require("./src/routes/examRoutes");
const resultRoutes = require("./src/routes/resultRoutes");
const homeworkResultRoutes = require("./src/routes/homeworkResultRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

// ================= 🧠 MOUNT ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/behavior", behaviorRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/homework-results", homeworkResultRoutes);
app.use("/api/notifications", notificationRoutes);

// ================= 🚀 ROOT ROUTE =================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduLink API 🚀",
    status: "Server is healthy",
    version: "1.0.0"
  });
});

// ================= 🚫 404 NOT FOUND =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "عفواً، هذا المسار (Route) غير موجود"
  });
});

// ================= 🔥 GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error("Critical Error:", err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // السطر ده بيظهر تفاصيل الخطأ للمبرمج فقط في مرحلة الـ Development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

module.exports = app;
