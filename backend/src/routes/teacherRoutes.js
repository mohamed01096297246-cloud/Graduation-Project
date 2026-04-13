const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const { getTeacherDashboard } = require("../controllers/teacherController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), teacherController.createTeacher);
router.get("/dashboard", protect, authorize("teacher"), getTeacherDashboard);

module.exports = router;