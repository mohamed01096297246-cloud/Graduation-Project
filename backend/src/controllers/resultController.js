const Result = require("../models/Result");
const Student = require("../models/Student");

// Teacher records result
exports.addResult = async (req, res) => {
  const { studentId, examId, marks } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const result = await Result.create({
    student: studentId,
    exam: examId,
    marks,
    recordedBy: req.user._id
  });

  res.status(201).json({
    message: "Result recorded successfully",
    result
  });
};

// Parent views results
exports.getParentResults = async (req, res) => {
  const students = await Student.find({ parent: req.user._id });
  const ids = students.map(s => s._id);

  const results = await Result.find({
    student: { $in: ids }
  })
    .populate("student exam")
    .sort({ createdAt: -1 });

  res.json(results);
};
