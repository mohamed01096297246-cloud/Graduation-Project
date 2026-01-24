const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    const attendance = await Attendance.create({
      student: studentId,
      status,
      recordedBy: req.user._id
    });

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
