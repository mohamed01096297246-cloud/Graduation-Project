const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification");


exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body; 

    const inputDate = date ? new Date(date) : new Date();
    inputDate.setHours(0, 0, 0, 0); 

    const attendance = await Attendance.create({
      student: studentId,
      date: inputDate,
      status,
      recordedBy: req.user._id 
    });
    if (status === "absent") {
      const student = await Student.findById(studentId);
      await Notification.create({
        title: "تنبيه غياب",
        message: `نحيطكم علماً بأن الطالب ${student.firstName} تم تسجيله غياب اليوم.`,
        target: "parent",
        parent: student.parent,
        createdBy: req.user._id
      });
    }

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
