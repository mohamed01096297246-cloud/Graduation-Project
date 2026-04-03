const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

exports.addTimetableEntry = async (req, res) => {
  try {
    const { grade, day, period, subject, teacherId } = req.body;

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeacherTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find({
      teacher: req.user._id
    }).sort({ day: 1, period: 1 });
    
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getParentTimetable = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id });
    
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this parent" });
    }

    const grades = [...new Set(students.map(s => s.grade))];

    const timetable = await Timetable.find({
      grade: { $in: grades }
    }).sort({ day: 1, period: 1 });

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};