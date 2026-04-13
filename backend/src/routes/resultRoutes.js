const express = require("express");
const router = express.Router();

const {
  addResult,
  getStudentResults,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("teacher"), addResult);

router.get(
  "/student/:studentId",
  protect,
  authorize("teacher", "admin", "parent"),
  getStudentResults
);

router.put("/:id", protect, authorize("admin"), updateResult);

router.delete("/:id", protect, authorize("admin"), deleteResult);

module.exports = router;