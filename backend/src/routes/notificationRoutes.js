const express = require("express");
const router = express.Router();

const {
  createNotification,
  getParentNotifications
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  createNotification
);

// Parent
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentNotifications
);

module.exports = router;
