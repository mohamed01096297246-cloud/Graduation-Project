const bcrypt = require("bcrypt");
const User = require("../models/User");
const Student = require("../models/Student");
const Schedule = require("../models/Schedule");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");


const mongoose = require("mongoose");

exports.createSubAdmin = async (req, res) => {
  try {

    const { firstName, lastName, nationalId,phoneNumber,email, } = req.body;

    const username = generateUsername(`${firstName} ${lastName}`);
    const password = generatePassword(); 

    const newAdmin = await User.create({
      firstName, lastName, nationalId, username, password,phoneNumber,email,
      role: "admin",
      active: true
    });

    res.status(201).json({ message: "تم إضافة أدمن جديد بنجاح", admin: newAdmin.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceToday = await Attendance.find({ date: { $gte: today } });
    const present = attendanceToday.filter(a => a.status === "present").length;
    const absent = attendanceToday.filter(a => a.status === "absent").length;

    res.json({
      stats: { totalStudents, totalTeachers, present, absent },
      latestNotifications: await Notification.find().sort({ createdAt: -1 }).limit(5)
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });


    if (user.username === "admin_master") {
      return res.status(403).json({ message: "لا يمكن حذف الحساب الرئيسي للنظام" });
    }


    if (user.role === "parent") {

      await Student.deleteMany({ parent: id });
    } 
    
    if (user.role === "teacher") {
    
      await Schedule.deleteMany({ teacher: id });
    }


    await User.findByIdAndDelete(id);

    res.json({ message: `تم حذف ${user.role} وجميع بياناته المرتبطة بنجاح` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); 

    if (!updatedUser) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.json({ message: "تم تحديث البيانات بنجاح", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID المستخدم غير صالح" });
    }

    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
