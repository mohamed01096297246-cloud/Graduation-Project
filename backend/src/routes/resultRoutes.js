const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/single", protect, authorize("teacher", "admin"), addGrade);

router.post("/add", protect, authorize("teacher"), resultController.addBulkGrades);

router.put("/update/:id", protect, authorize("admin"), resultController.updateGrade);

router.delete("/delete/:id", protect, authorize("admin"), resultController.deleteGrade);

router.get("/report/:studentId/:examId", protect, authorize("parent", "admin"), resultController.getReportCard);

module.exports = router;