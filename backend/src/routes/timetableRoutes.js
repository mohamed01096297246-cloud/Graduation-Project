const express = require("express");
const router = express.Router();

const {
  addTimetableEntry,
  getTeacherTimetable,
  getParentTimetable
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  addTimetableEntry
);

// Teacher
router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  getTeacherTimetable
);

// Parent
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentTimetable
);

module.exports = router;
