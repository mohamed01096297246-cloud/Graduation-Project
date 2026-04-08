const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/dashboard", adminController.getAdminDashboard);

router.get("/users", adminController.getAllUsers);
router.get("/user/:id", adminController.getUserById);

router.post("/sub-admin", adminController.createSubAdmin);

router.put("/user/:id", adminController.updateUser);
router.delete("/user/:id", adminController.deleteUser);

module.exports = router;