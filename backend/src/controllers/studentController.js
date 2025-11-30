const Student = require("../models/Student");

// داله تجيب لنا كل الطلاب 
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("parent");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// داله بتجيب طالب واحد 
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("parent");
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
