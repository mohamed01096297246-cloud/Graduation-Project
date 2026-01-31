const express = require("express");
const router = express.Router();

const { createExam, getExamsByGrade } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  createExam
);

// View exams by grade
router.get(
  "/:grade",
  protect,
  getExamsByGrade
);

module.exports = router;
