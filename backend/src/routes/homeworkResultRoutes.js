const express = require("express");
const router = express.Router();

const { 
  gradeHomework, 
  getParentHomeworkDashboard 
} = require("../controllers/homeworkResultController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/grade/:homeworkId", protect, authorize("teacher"), gradeHomework);

router.get("/dashboard/:studentId", protect, authorize("parent", "admin"), getParentHomeworkDashboard);

module.exports = router;