const express = require("express");
const router = express.Router();

const {
  createHomework,
  getAllHomework,
  getHomework,
  updateHomework,
  deleteHomework
} = require("../controllers/homeworkController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("teacher", "admin"), createHomework);

router.get("/", protect, authorize("teacher", "admin", "parent"), getAllHomework);

router.get("/:id", protect, authorize("teacher", "admin", "parent"), getHomework);

router.put("/:id", protect, authorize("teacher", "admin"), updateHomework);

router.delete("/:id", protect, authorize("admin"), deleteHomework);

module.exports = router;