const express = require("express");
const router = express.Router();

const {
  gradeHomework,
  getStudentResults,
  updateResult,
  deleteResult
} = require("../controllers/homeworkResultController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("teacher", "admin"), gradeHomework);

router.get("/student/:studentId", protect, authorize("teacher", "admin", "parent"), getStudentResults);

router.put("/:id", protect, authorize("teacher", "admin"), updateResult);

router.delete("/:id", protect, authorize("admin"), deleteResult);

module.exports = router;