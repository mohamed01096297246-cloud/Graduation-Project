const express = require("express");
const router = express.Router();

const {
  gradeHomework,
  getParentHomeworkResults
} = require("../controllers/homeworkResultController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Teacher
router.post(
  "/",
  protect,
  authorize("teacher"),
  gradeHomework
);

// Parent
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentHomeworkResults
);

module.exports = router;
