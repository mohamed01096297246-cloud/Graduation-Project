const express = require("express");
const router = express.Router();

const {
  addHomework,
  getParentHomework
} = require("../controllers/homeworkController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("teacher"),
  addHomework
);

router.get(
  "/parent",
  protect,
  authorize("parent"),
  getParentHomework
);

module.exports = router;
