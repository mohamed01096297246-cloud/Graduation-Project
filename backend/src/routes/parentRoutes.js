const express = require("express");
const router = express.Router();

const { getParentDashboard } = require("../controllers/parentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, authorize("parent"), getParentDashboard);

module.exports = router;