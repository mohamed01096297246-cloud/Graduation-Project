const Result = require("../models/Result");
const Student = require("../models/Student");

exports.addGrade = async (req, res) => {
  try {
    const { studentId, examId, subjectId, grade } = req.body;
    
    const result = await Result.findOneAndUpdate(
      { student: studentId, exam: examId, subject: subjectId },
      { grade, teacher: req.user.id },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: "تم رصد الدرجة", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReportCard = async (req, res) => {
  try {
    const { studentId, examId } = req.params;

const student = await Student.findById(studentId)
      .populate("parent", "firstName lastName")
      .populate("grade", "name academicYear") 
      .populate("classroom", "name");         

    const grades = await Result.find({ student: studentId, exam: examId })

    if (grades.length === 0) return res.status(404).json({ message: "لم يتم رصد درجات بعد" });

    let totalStudentMarks = 0;
    let totalMaxMarks = grades.length * 100;

    grades.forEach(g => {
      totalStudentMarks += g.grade;
    });

    res.status(200).json({
      success: true,
      data: {
        reportTitle: `نتائج امتحان الطالب ${student.firstName} في ${grades[0].exam.title}`,
        academicYear: grades[0].exam.academicYear,
        subjects: grades,
        summary: {
          studentTotal: totalStudentMarks,
          maxTotal: totalMaxMarks,
          percentage: ((totalStudentMarks / totalMaxMarks) * 100).toFixed(2) + "%"
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addBulkGrades = async (req, res) => {
  try {
    const { examId, subjectId, gradesList } = req.body; 
  

    if (!gradesList || gradesList.length === 0) {
      return res.status(400).json({ message: "يجب إرسال قائمة الدرجات" });
    }

    const bulkOps = gradesList.map((record) => ({
      updateOne: {
        filter: { student: record.studentId, exam: examId, subject: subjectId },
        update: { 
          $set: { 
            grade: record.grade, 
            teacher: req.user.id 
          } 
        },
        upsert: true
      }
    }));

    await Result.bulkWrite(bulkOps);

    res.status(200).json({ 
      success: true, 
      message: `تم رصد الدرجات لعدد (${gradesList.length}) طالب بنجاح دفعة واحدة.` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params; 
    const { grade } = req.body;

    if (grade < 0 || grade > 100) {
      return res.status(400).json({ message: "الدرجة يجب أن تكون بين 0 و 100" });
    }

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { 
        grade, 
        updatedBy: req.user.id 
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: "student",
      select: "firstName lastName",
      populate: [
        { path: "grade", select: "name academicYear" },
        { path: "classroom", select: "name" }
      ]
    })
    .populate("subject", "name")
    .populate("exam", "title academicYear");

    if (!updatedResult) {
      return res.status(404).json({ message: "سجل الدرجة غير موجود" });
    }

    res.status(200).json({
      success: true,
      message: "تم تعديل الدرجة بنجاح بواسطة الإدارة",
      data: updatedResult
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Result.findByIdAndDelete(id);

    if (!result) return res.status(404).json({ message: "السجل غير موجود" });

    res.status(200).json({ success: true, message: "تم حذف سجل الدرجة نهائياً" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};