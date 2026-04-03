const express = require("express");
const router = express.Router();

const { createNotification, getParentNotifications } = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin", "teacher"), createNotification);

router.get("/parent", protect, authorize("parent"), getParentNotifications);

module.exports = router;