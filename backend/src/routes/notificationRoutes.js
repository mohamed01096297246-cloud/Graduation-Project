const express = require("express");
const router = express.Router();

const {
  createNotification,
  getParentNotifications
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), createNotification);

router.get("/parent", protect, authorize("parent"), getParentNotifications);

router.put("/:id", protect, authorize("admin"), notificationController.updateNotification);

router.delete("/:id", protect, authorize("admin"), notificationController.deleteNotification);

module.exports = router;