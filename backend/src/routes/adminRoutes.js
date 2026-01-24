const express = require("express");
const router = express.Router();
const { createAdmin } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.post("/create-admin", createAdmin,
    protect,
  authorize("admin"),
  createAdmin
);
const { createTeacher } = require("../controllers/adminController");

router.post(
  "/create-teacher",
  protect,
  authorize("admin"),
  createTeacher
);

module.exports = router;
