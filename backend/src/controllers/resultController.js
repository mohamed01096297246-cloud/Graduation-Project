const Result = require("../models/Result");
const Exam = require("../models/Exam");
const Student = require("../models/Student");

exports.addResult = async (req, res) => {
  try {
    const { exam, student, obtainedMarks, remarks } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "رصد الدرجات من صلاحية المعلمين فقط" });
    }

    const examData = await Exam.findById(exam);
    const studentData = await Student.findById(student);

    if (!examData || !studentData) {
      return res.status(404).json({ message: "الامتحان أو الطالب غير موجود" });
    }

    if (examData.subject !== req.user.subject) {
      return res.status(403).json({ 
        message: `غير مسموح لك برصد درجات مادة ${examData.subject}؛ تخصصك هو ${req.user.subject}` 
      });
    }

    if (!req.user.assignedClassrooms.includes(studentData.classroom)) {
      return res.status(403).json({ message: "هذا الطالب ليس من ضمن فصولك المكلفة بها" });
    }

    const result = await Result.create({
      exam,
      student,
      obtainedMarks,
      remarks,
      recordedBy: req.user.id
    });

    res.status(201).json({ message: "تم رصد الدرجة بنجاح", result });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "هذا الطالب مرصود له درجة بالفعل في هذا الامتحان" });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === 'parent') {
      const student = await Student.findById(studentId);
      if (!student || student.parent.toString() !== req.user.id) {
        return res.status(403).json({ message: "لا يمكنك رؤية نتائج طلاب آخرين" });
      }
    }

    const data = await Result.find({ student: studentId })
      .populate("exam")
      .populate("recordedBy", "firstName lastName");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "تعديل الدرجات بعد رصدها مقتصر على الإدارة فقط لمنع التلاعب" });
    }

    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ message: "النتيجة غير موجودة" });

    res.json({ message: "تم تعديل الدرجة بواسطة الإدارة", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "حذف الدرجات من صلاحيات الإدارة فقط" });
    }

    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });

    res.json({ message: "تم حذف النتيجة بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};