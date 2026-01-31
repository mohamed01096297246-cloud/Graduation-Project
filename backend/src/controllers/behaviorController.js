const Behavior = require("../models/Behavior");
const Student = require("../models/Student");

// المعلم يضيف سلوك
exports.addBehavior = async (req, res) => {
  const { studentId, note } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const behavior = await Behavior.create({
    student: studentId,
    teacher: req.user._id,
    note
  });

  res.status(201).json({
    message: "Behavior recorded successfully",
    behavior
  });
};

// ولي الأمر يشوف سلوك أولاده
exports.getParentBehaviors = async (req, res) => {
  const students = await Student.find({ parent: req.user._id });
  const ids = students.map(s => s._id);

  const behaviors = await Behavior.find({
    student: { $in: ids }
  }).populate("student teacher");

  res.json(behaviors);
};
