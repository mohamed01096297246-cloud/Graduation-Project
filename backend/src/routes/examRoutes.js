const express = require("express");
const router = express.Router();

// استدعاء دوال الكنترولر الخاصة بالامتحانات
const examController = require("../controllers/examController");

// استدعاء ميدل وير الحماية والصلاحيات
const { protect, authorize } = require("../middleware/authMiddleware");

// ==========================================
// 1. إنشاء جدول امتحانات جديد (صلاحية: الأدمن فقط)
// ==========================================
router.post("/", protect, authorize("admin"), examController.createExamSchedule);

// ==========================================
// 2. استعراض كل جداول الامتحانات (صلاحية: الأدمن، وممكن نضيف المعلم لو حابب يشوفها)
// ==========================================
router.get("/", protect, authorize("admin", "teacher"), examController.getAllExams);

// ==========================================
// 3. استعراض جدول الامتحانات الخاص بطالب معين (صلاحية: ولي الأمر، الأدمن)
// ==========================================
router.get("/student/:studentId", protect, authorize("parent", "admin"), examController.getStudentExams);

module.exports = router;