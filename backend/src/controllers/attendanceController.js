const Attendance = require("../models/Attendance");
const Student = require("../models/Student");


exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: date || new Date(),
      status,
      recordedBy: req.user._id
    });

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Attendance already recorded for this student today"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.getParentAttendance = async (req, res) => {
  const students = await Student.find({ parent: req.user._id });
  const studentIds = students.map(s => s._id);

  const attendance = await Attendance.find({
    student: { $in: studentIds }
  })
    .populate("student")
    .sort({ date: -1 });

  res.json(attendance);
};

exports.getTeacherAttendance = async (req, res) => {
  const attendance = await Attendance.find({
    recordedBy: req.user._id
  })
    .populate("student")
    .sort({ date: -1 });

  res.json(attendance);
};
