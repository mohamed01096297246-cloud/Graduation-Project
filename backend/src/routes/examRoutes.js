const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), examController.createExam);
router.get("/", protect, authorize("teacher", "admin", "parent"), examController.getAllExams);
router.get("/:id", protect, authorize("teacher", "admin", "parent"), examController.getExam);
router.put("/:id", protect, authorize("admin"), examController.updateExam);
router.delete("/:id", protect, authorize("admin"), examController.deleteExam);

module.exports = router;