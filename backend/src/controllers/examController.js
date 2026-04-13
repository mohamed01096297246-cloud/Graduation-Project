const Exam = require("../models/Exam");
const Student = require("../models/Student");

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "تم إنشاء جدول الامتحان بنجاح",
      exam,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "هذا الامتحان مسجل بالفعل لنفس الصف والمادة والتاريخ",
      });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "parent") {
      const students = await Student.find({ parent: req.user.id }).select(
        "grade"
      );
      const grades = [...new Set(students.map((s) => s.grade))];
      filter = { grade: { $in: grades } };
    } else if (req.user.role === "teacher") {
      filter = { grade: { $in: req.user.assignedGrades || [] } };
    }

    const exams = await Exam.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!exam) {
      return res.status(404).json({ message: "الامتحان غير موجود" });
    }

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ message: "الامتحان غير موجود" });
    }

    res.json({
      message: "تم تحديث جدول الامتحان بنجاح",
      exam,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "يوجد امتحان آخر بنفس البيانات",
      });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "الامتحان غير موجود" });
    }

    res.json({ message: "تم حذف جدول الامتحان بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};