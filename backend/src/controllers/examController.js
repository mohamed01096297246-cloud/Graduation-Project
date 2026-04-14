const Exam = require("../models/Exam");
const Student = require("../models/Student");

exports.createExamSchedule = async (req, res) => {
  try {
    const { title, academicYear, grade, timetable } = req.body;

    const exam = await Exam.create({
      title,
      academicYear,
      grade,
      timetable
    });

    res.status(201).json({
      success: true,
      message: "تم إنشاء جدول الامتحانات بنجاح",
      data: exam
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("timetable.subject", "name") 
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentExams = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    if (req.user.role === 'parent' && student.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مصرح لك" });
    }

    const exams = await Exam.find({ grade: student.grade })
      .populate("timetable.subject", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};