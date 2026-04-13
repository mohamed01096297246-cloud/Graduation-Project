const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
    }

    const user = await User.findOne({ username: username.trim() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "هذا الحساب معطل حالياً، راجع الإدارة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        subject: user.subject || null 
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};