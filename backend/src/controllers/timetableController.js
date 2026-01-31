const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

// ===============================
// Admin: إضافة حصة في الجدول
// ===============================
exports.addTimetableEntry = async (req, res) => {
  const { grade, day, period, subject, teacherId } = req.body;

  // منع تكرار نفس الحصة
  const exists = await Timetable.findOne({ grade, day, period });
  if (exists) {
    return res.status(400).json({
      message: "This period is already assigned for this grade"
    });
  }

  const entry = await Timetable.create({
    grade,
    day,
    period,
    subject,
    teacher: teacherId
  });

  res.status(201).json({
    message: "Timetable entry added successfully",
    entry
  });
};

// ===============================
// Teacher: يشوف جدوله
// ===============================
exports.getTeacherTimetable = async (req, res) => {
  const teacherId = req.user._id;

  const timetable = await Timetable.find({
    teacher: teacherId
  }).sort({ day: 1, period: 1 });

  res.json(timetable);
};

// ===============================
// Parent: يشوف جدول ابنه
// ===============================
exports.getParentTimetable = async (req, res) => {
  const student = await Student.findOne({ parent: req.user._id });

  if (!student) {
    return res.status(404).json({ message: "No student found" });
  }

  const timetable = await Timetable.find({
    grade: student.grade
  }).sort({ day: 1, period: 1 });

  res.json(timetable);
};
