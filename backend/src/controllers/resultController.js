const Result = require("../models/Result");
const Exam = require("../models/Exam");
const Student = require("../models/Student");

exports.addResult = async (req, res) => {
  try {
    const { exam, student, obtainedMarks, remarks } = req.body;

    const examData = await Exam.findById(exam);
    const studentData = await Student.findById(student);

    if (!examData || !studentData) {
      return res.status(404).json({ message: "الامتحان أو الطالب غير موجود" });
    }

    if (obtainedMarks > examData.totalMarks) {
      return res.status(400).json({
        message: `الدرجة لا يمكن أن تتجاوز ${examData.totalMarks}`,
      });
    }

    if (req.user.subject && examData.subject !== req.user.subject) {
      return res.status(403).json({
        message: `غير مسموح لك برصد درجات مادة ${examData.subject}`,
      });
    }

    if (
      req.user.assignedClassrooms &&
      !req.user.assignedClassrooms.includes(studentData.classroom.toString())
    ) {
      return res.status(403).json({
        message: "هذا الطالب ليس ضمن فصولك",
      });
    }

    const result = await Result.create({
      exam,
      student,
      obtainedMarks,
      remarks,
      recordedBy: req.user.id,
    });

    res.status(201).json({
      message: "تم رصد الدرجة بنجاح",
      result,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "تم رصد درجة هذا الطالب بالفعل في هذا الامتحان",
      });
    }

    res.status(400).json({ message: err.message });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "parent") {
      const student = await Student.findById(studentId);

      if (!student || student.parent.toString() !== req.user.id) {
        return res.status(403).json({
          message: "غير مسموح لك بعرض نتائج هذا الطالب",
        });
      }
    }

    const data = await Result.find({ student: studentId })
      .populate("exam")
      .populate("student", "firstName lastName classroom")
      .populate("recordedBy", "firstName lastName");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      return res.status(404).json({ message: "النتيجة غير موجودة" });
    }

    res.json({
      message: "تم تعديل النتيجة بنجاح",
      result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "النتيجة غير موجودة" });
    }

    res.json({ message: "تم حذف النتيجة بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};