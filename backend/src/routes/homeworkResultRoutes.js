const express = require("express");
const router = express.Router();

// استدعاء دوال الكنترولر (من ملف homeworkResultController)
const { 
  gradeHomework, 
  getParentHomeworkDashboard 
} = require("../controllers/homeworkResultController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ==========================================
// 1. رصد درجات الواجب أو تسجيله كـ "لم يسلم" (صلاحية: المعلم فقط)
// ==========================================
// لاحظ إننا بنبعت الـ ID بتاع الواجب في الرابط نفسه
router.post("/grade/:homeworkId", protect, authorize("teacher"), gradeHomework);

// ==========================================
// 2. الشاشة الذكية لولي الأمر (الواجبات المطلوبة + السجل والدرجات)
// ==========================================
// صلاحية: ولي الأمر (عشان يتابع ابنه) والأدمن (عشان يراقب المنظومة)
router.get("/dashboard/:studentId", protect, authorize("parent", "admin"), getParentHomeworkDashboard);

module.exports = router;