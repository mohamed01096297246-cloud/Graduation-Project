const express = require("express");
const router = express.Router();

// استدعاء دوال الكنترولر (تأكد من وجودها في ملف homeworkController)
const { 
  createHomework, 
  getStudentHomeworks 
} = require("../controllers/homeworkController");

// استدعاء ميدل وير الحماية
const { protect, authorize } = require("../middleware/authMiddleware");

// ==========================================
// 1. إنشاء واجب جديد (صلاحية: المعلم فقط)
// ==========================================
router.post("/", protect, authorize("teacher"), createHomework);

// ==========================================
// 2. عرض الواجبات المطلوبة لطالب معين (صلاحية: ولي الأمر، الأدمن)
// ==========================================
router.get("/student/:studentId", protect, authorize("parent", "admin"), getStudentHomeworks);

// (يمكنك إضافة راوتس التعديل والحذف لاحقاً بنفس النمط)
// router.put("/:id", protect, authorize("teacher"), updateHomework);
// router.delete("/:id", protect, authorize("teacher", "admin"), deleteHomework);

module.exports = router;