const Homework = require("../models/Homework");
const Student = require("../models/Student");

// Teacher adds homework
exports.addHomework = async (req, res) => {
  const { title, description, grade, subject, dueDate } = req.body;

  const homework = await Homework.create({
    title,
    description,
    grade,
    subject,
    dueDate,
    teacher: req.user._id
  });

  res.status(201).json({
    message: "Homework added successfully",
    homework
  });
};

// Parent views homework
exports.getParentHomework = async (req, res) => {
  const students = await Student.find({ parent: req.user._id });
  const grades = [...new Set(students.map(s => s.grade))];

  const homework = await Homework.find({
    grade: { $in: grades }
  });

  res.json(homework);
};
