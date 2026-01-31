const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getParentAttendance,
  getTeacherAttendance
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Teacher: تسجيل حضور
router.post(
  "/",
  protect,
  authorize("teacher"),
  markAttendance
);

// Parent: عرض حضور الأبناء
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentAttendance
);

// Teacher: عرض حضوره المسجل
router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  getTeacherAttendance
);

module.exports = router;
