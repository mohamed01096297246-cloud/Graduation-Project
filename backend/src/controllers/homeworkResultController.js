const HomeworkResult = require("../models/HomeworkResult");
const Student = require("../models/Student");

exports.gradeHomework = async (req, res) => {
  try {
    const { homeworkId, studentId, marks, feedback } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const result = await HomeworkResult.create({
      homework: homeworkId,
      student: studentId,
      marks,
      feedback,
      gradedBy: req.user._id
    });

    res.status(201).json({
      message: "Homework graded successfully",
      result
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This student has already been graded for this homework"
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getParentHomeworkResults = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id });
    const ids = students.map(s => s._id);

    const results = await HomeworkResult.find({
      student: { $in: ids }
    })
    .populate("homework student")
    .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};