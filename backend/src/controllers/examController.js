const Exam = require("../models/Exam");

// Admin only
exports.createExam = async (req, res) => {
  const { title, grade, subject, term, totalMarks, date } = req.body;

  const exam = await Exam.create({
    title,
    grade,
    subject,
    term,
    totalMarks,
    date
  });

  res.status(201).json({
    message: "Exam created successfully",
    exam
  });
};

// Parent / Teacher
exports.getExamsByGrade = async (req, res) => {
  const { grade } = req.params;

  const exams = await Exam.find({ grade });

  res.json(exams);
};
