const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize, isSuperAdmin } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));


router.get("/dashboard", adminController.getAdminDashboard);
router.get("/users", adminController.getAllUsers);
router.get("/user/:id", adminController.getUserById);


router.post("/sub-admin", isSuperAdmin, adminController.createSubAdmin);
router.put("/user/:id", isSuperAdmin, adminController.updateUser);
router.delete("/user/:id", isSuperAdmin, adminController.deleteUser);

module.exports = router;