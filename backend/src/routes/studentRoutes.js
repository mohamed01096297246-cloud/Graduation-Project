const express = require("express");
const router = express.Router();
const { addStudent, getStudents, getStudent } = require("../controllers/studentController");

router.post("/add", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudent);

module.exports = router;
