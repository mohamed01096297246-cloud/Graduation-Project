const express = require("express");
const router = express.Router();
const { createExam, getExamsByGrade, getParentExams } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

// إنشاء امتحان (للأدمن)
router.post(
  "/",
  protect,
  authorize("admin"),
  createExam
);

// جلب امتحانات الأبناء (لولي الأمر) - ده اللي كان ناقص!
router.get(
  "/parent/my-exams",
  protect,
  getParentExams
);

// جلب الامتحانات حسب السنة الدراسية
router.get(
  "/:grade",
  protect,
  getExamsByGrade
);

module.exports = router;