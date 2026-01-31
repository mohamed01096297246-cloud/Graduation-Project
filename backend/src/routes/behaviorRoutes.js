const express = require("express");
const router = express.Router();

const {
  addBehavior,
  getParentBehaviors
} = require("../controllers/behaviorController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Teacher
router.post(
  "/",
  protect,
  authorize("teacher"),
  addBehavior
);

// Parent
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentBehaviors
);

module.exports = router;
