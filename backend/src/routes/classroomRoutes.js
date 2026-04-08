const express = require("express");
const router = express.Router();

const {
  createClassroom,
  getAllClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom
} = require("../controllers/classroomController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), createClassroom);

router.get("/", protect, authorize("admin", "teacher", "parent"), getAllClassrooms);

router.get("/:id", protect, authorize("admin", "teacher", "parent"), getClassroom);

router.put("/:id", protect, authorize("admin"), updateClassroom);

router.delete("/:id", protect, authorize("admin"), deleteClassroom);

module.exports = router;