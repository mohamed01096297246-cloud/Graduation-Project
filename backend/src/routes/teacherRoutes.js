const express = require("express");
const router = express.Router();

const { getTeacherDashboard } = require("../controllers/teacherController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, authorize("teacher"), getTeacherDashboard);

module.exports = router;