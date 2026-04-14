const express = require("express");
const router = express.Router();

const { 
  createHomework, 
  getStudentHomeworks 
} = require("../controllers/homeworkController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("teacher"), createHomework);

router.get("/student/:studentId", protect, authorize("parent", "admin"), getStudentHomeworks);



module.exports = router;