const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudent,
  getStudentsByParent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), createStudent);

router.get("/", protect, authorize("admin", "teacher"), getStudents);
router.get("/parent/:parentId", protect, getStudentsByParent);
router.get("/:id", protect, getStudent);

router.put("/:id", protect, authorize("admin"), updateStudent);

router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;
