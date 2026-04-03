const express = require("express");
const router = express.Router();

const { createAdmin, createStudent, createTeacher } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.post("/create-admin", createAdmin);

router.post("/create-student", createStudent);

router.post("/create-teacher", createTeacher);

module.exports = router;