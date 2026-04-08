const express = require("express");
const router = express.Router();

const {
  createAttendance,
  getAllAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("teacher"), createAttendance);

router.get("/", protect, authorize("teacher", "admin"), getAllAttendance);


router.get("/student/:studentId", protect, authorize("teacher", "admin", "parent"), getStudentAttendance);

router.put("/:id", protect, authorize("teacher"), updateAttendance);

router.delete("/:id", protect, authorize("teacher"), deleteAttendance);

module.exports = router;
