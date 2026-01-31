const express = require("express");
const router = express.Router();

const {
  createAdmin,
  createTeacher,
  createStudent
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/create-admin", createAdmin);

router.post(
  "/create-teacher",
  protect,
  authorize("admin"),
  createTeacher
);

router.post(
  "/create-student",
  protect,
  authorize("admin"),
  createStudent
);

module.exports = router;
