const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getParentAttendance,
  getTeacherAttendance
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("teacher"),
  markAttendance
);

router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentAttendance
);

router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  getTeacherAttendance
);

module.exports = router;
