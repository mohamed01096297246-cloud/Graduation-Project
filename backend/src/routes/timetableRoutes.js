const express = require("express");
const router = express.Router();

const {
  addTimetableEntry,
  getTeacherTimetable,
  getParentTimetable
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  addTimetableEntry
);

router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  getTeacherTimetable
);

router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentTimetable
);

module.exports = router;
