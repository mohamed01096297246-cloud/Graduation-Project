const express = require("express");
const router = express.Router();
const { createStudent } = require("../controllers/adminController");

router.post("/create-student", createStudent);
module.exports = router;
