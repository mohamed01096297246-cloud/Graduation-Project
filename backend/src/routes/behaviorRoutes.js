const express = require("express");
const router = express.Router();
const behaviorController = require("../controllers/behaviorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("teacher"), behaviorController.createBehavior);

router.get("/", protect, authorize("teacher", "admin"), behaviorController.getAllBehavior);

router.get("/student/:studentId", protect, authorize("teacher", "admin", "parent"), behaviorController.getStudentBehavior);

router.delete("/:id", protect, authorize("admin","teacher"), behaviorController.deleteBehavior);

module.exports = router;
