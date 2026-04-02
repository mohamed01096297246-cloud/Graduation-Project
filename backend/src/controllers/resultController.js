const Result = require("../models/Result");
const Student = require("../models/Student");


exports.addResult = async (req, res) => {
  try {
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
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Result already exists for this student in this exam" });
    }
    res.status(500).json({ error: err.message });
  }
};


exports.getParentResults = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id });
    const ids = students.map(s => s._id);

    const results = await Result.find({
      student: { $in: ids }
    })
    .populate({
        path: "student",
        select: "firstName lastName grade classroom" 
    })
    .populate("exam")
    .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};