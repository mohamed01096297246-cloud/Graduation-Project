const HomeworkResult = require("../models/HomeworkResult");

exports.gradeHomework = async (req, res) => {
  try {
    const { homework, student, marks, feedback } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "هذه الصلاحية للمعلمين فقط" });
    }

    const homeworkData = await Homework.findById(homework);
    if (!homeworkData || homeworkData.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "لا يمكنك رصد درجات لواجب لم تقم بإنشائه" });
    }

    const studentData = await Student.findById(student);
    if (!req.user.assignedClassrooms.includes(studentData.classroom)) {
      return res.status(403).json({ message: "هذا الطالب ليس من ضمن فصولك المكلف بها" });
    }

    const result = await HomeworkResult.create({
      homework,
      student,
      marks,
      feedback,
      gradedBy: req.user.id
    });

    res.status(201).json({ message: "تم رصد الدرجة بنجاح", result });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "تم رصد درجة لهذا الطالب في هذا الواجب مسبقاً" });
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

    const data = await HomeworkResult.find({ student: studentId })
      .populate("homework", "title subject")
      .populate("gradedBy", "firstName lastName");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const result = await HomeworkResult.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "النتيجة غير موجودة" });

    if (req.user.role !== 'teacher' && result.gradedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح لك بتعديل درجات رصدها مدرس آخر" });
    }

    const updated = await HomeworkResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await HomeworkResult.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== 'teacher' && result.gradedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح لك بحذف هذه النتيجة" });
    }

    await result.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};