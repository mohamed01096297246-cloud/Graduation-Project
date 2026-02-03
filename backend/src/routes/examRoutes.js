const express = require("express");
const router = express.Router();

const { createExam, getExamsByGrade } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  createExam
);

router.get(
  "/:grade",
  protect,
  getExamsByGrade
);

module.exports = router;
