// الاكواد دي اساسيه علي طول بتستدعي المكتبات المهمه في الرواتنج 
const express = require("express");
const router = express.Router();
 //اللي جي دا هو ال endpoints 
const { getStudents, getStudent } = require("../controllers/studentController");
router.get("/", getStudents);
router.get("/:id", getStudent);
module.exports = router;