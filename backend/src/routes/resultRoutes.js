const express = require("express");
const router = express.Router();

const { addResult, getParentResults } = require("../controllers/resultController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Teacher
router.post(
  "/",
  protect,
  authorize("teacher"),
  addResult
);

// Parent
router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentResults
);

module.exports = router;
