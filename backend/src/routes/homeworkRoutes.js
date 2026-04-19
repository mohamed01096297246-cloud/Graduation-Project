const express = require("express");
const router = express.Router();

const { 
  createHomework, 
  getStudentHomeworks, 
  updateHomework, 
  deleteHomework  
} = require("../controllers/homeworkController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("teacher"), createHomework);

router.get("/student/:studentId", protect, authorize("parent", "admin"), getStudentHomeworks);

router.put("/:id", protect, authorize("teacher"), updateHomework);

router.delete("/:id", protect, authorize("teacher", "admin"), deleteHomework);



module.exports = router;