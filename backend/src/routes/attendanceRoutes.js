const express = require("express");
const router = express.Router();

const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  getStudentAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("teacher"), createAttendance);

router.get("/", protect, authorize("teacher", "admin"), getAllAttendance);

router.get("/", protect, authorize("admin"), getAttendanceById );


router.get("/student/:studentId", protect, authorize("parent"), getStudentAttendance);

router.put("/:id", protect, authorize("teacher"), updateAttendance);

module.exports = router;
