const HomeworkResult = require("../models/HomeworkResult");
const Student = require("../models/Student");

// Teacher grades homework
exports.gradeHomework = async (req, res) => {
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
};

// Parent views homework grades
exports.getParentHomeworkResults = async (req, res) => {
  const students = await Student.find({ parent: req.user._id });
  const ids = students.map(s => s._id);

  const results = await HomeworkResult.find({
    student: { $in: ids }
  })
    .populate("homework student")
    .sort({ createdAt: -1 });

  res.json(results);
};
