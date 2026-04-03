const express = require("express");
const router = express.Router();

const { markAttendance, getAttendanceForParent } = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("teacher"), markAttendance);

router.get("/parent", protect, authorize("parent"), getAttendanceForParent);

router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  getTeacherAttendance
);
module.exports = router;
