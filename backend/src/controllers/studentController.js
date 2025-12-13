const Student = require("../models/Student");

exports.getStudents = async (req, res) => {
  const students = await Student.find().populate("parent");
  res.json(students);
};

exports.getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate("parent");
  if (!student) return res.status(404).json({ message: "Not found" });
  res.json(student);
};

exports.getStudentsByParent = async (req, res) => {
  const students = await Student.find({
    parent: req.params.parentId,
  });
  res.json(students);
};
