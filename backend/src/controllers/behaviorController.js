const Behavior = require("../models/Behavior");
const Student = require("../models/Student");

exports.addBehavior = async (req, res) => {
  try { 
    const { studentId, note, type } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const behavior = await Behavior.create({
      student: studentId,
      teacher: req.user._id,
      type,
      note
    });

    res.status(201).json({
      message: "Behavior recorded successfully",
      behavior
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBehaviorForParent = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id }).select("_id");
    const studentIds = students.map(s => s._id);

    const behaviors = await Behavior.find({
      student: { $in: studentIds }
    })
    .populate("student", "firstName lastName grade classroom") 
    .sort({ createdAt: -1 }); 

    res.status(200).json(behaviors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};