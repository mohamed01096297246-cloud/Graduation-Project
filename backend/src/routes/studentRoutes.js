const express = require("express");
const router = express.Router();
const { getStudents, getStudent, getStudentsByParent } = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "teacher"), getStudents);

router.get("/parent/:parentId", protect, authorize("admin", "teacher", "parent"), getStudentsByParent);

router.get("/:id", protect, authorize("admin", "teacher", "parent"), getStudent);

module.exports = router;
