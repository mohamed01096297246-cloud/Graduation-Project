const express = require("express");
const router = express.Router();

const { createExam, getExamsByGrade, getParentExams } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("admin"), createExam);


router.get("/parent/my-exams", protect, authorize("parent"), getParentExams);


router.get("/:grade", protect, authorize("admin", "teacher"), getExamsByGrade);

module.exports = router;