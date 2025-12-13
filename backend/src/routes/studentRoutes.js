const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentsByParent,
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/:id", getStudent);
router.get("/parent/:parentId", getStudentsByParent);

module.exports = router;
