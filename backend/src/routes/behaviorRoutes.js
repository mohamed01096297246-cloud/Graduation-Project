const express = require("express");
const router = express.Router();

const {
  addBehavior,
  getBehaviorForParent
} = require("../controllers/behaviorController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("teacher"),
  addBehavior
)
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getBehaviorForParent
);

module.exports = router;
