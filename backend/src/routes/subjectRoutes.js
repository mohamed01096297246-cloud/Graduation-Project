const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const subjectController = require("../controllers/subjectController");

router.post("/", protect, authorize("admin"),subjectController.createSubject);
router.get("/", protect, subjectController.getAllSubjects);
router.put("/:id", protect, authorize("admin"),subjectController.updateSubject);
router.delete("/:id", protect, authorize("admin"),subjectController.deleteSubject);

module.exports = router;