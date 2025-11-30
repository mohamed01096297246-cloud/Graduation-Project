const express = require("express");
const router = express.Router();

const { createStudent } = require("../controllers/adminController");

// Route for admin to create student + parent
router.post("/create-student", createStudent);

module.exports = router;   // ← هنا كان الخطأ

