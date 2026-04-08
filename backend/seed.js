const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Connected to Database for seeding...");

    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("⚠️ Admin already exists. No seeding needed.");
      process.exit();
    }

    const adminData = {
      firstName: "Super",
      lastName: "Admin",
      nationalId: "12345678901234",
      phoneNumber:"01096297246",
      username: "admin_master",
      password: "adminPassword123", 
      role: "admin",
      active: true
    };

    await User.create(adminData);
    console.log("✅ Super Admin created successfully!");
    console.log("👤 Username: admin_master");
    console.log("🔑 Password: adminPassword123");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();