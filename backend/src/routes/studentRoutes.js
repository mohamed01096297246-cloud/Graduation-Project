const express = require("express");
const router = express.Router();

const { getStudentsByGrade } = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/grade/:grade", 

  protect, authorize("admin", "teacher"),

  getStudentsByGrade);

module.exports = router;
