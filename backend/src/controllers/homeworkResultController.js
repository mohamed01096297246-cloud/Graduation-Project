const HomeworkResult = require("../models/HomeworkResult");
const Homework = require("../models/Homework");
const Student = require("../models/Student");
const { sendAlertEmail } = require("../utils/emailService"); 

exports.gradeHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const { studentId, status, score, teacherFeedback } = req.body;

    const homework = await Homework.findById(homeworkId);
    if (!homework) return res.status(404).json({ message: "الواجب غير موجود" });

    if (homework.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مصرح لك بتصحيح هذا الواجب" });
    }

    const result = await HomeworkResult.findOneAndUpdate(
      { homework: homeworkId, student: studentId },
      { 
        status, 
        score: status === "missing" ? 0 : score, 
        teacherFeedback, 
        gradedBy: req.user.id 
      },
      { new: true, upsert: true } 
    );

    if (status === "missing") {
      const studentData = await Student.findById(studentId).populate("parent");
      if (studentData && studentData.parent && studentData.parent.email) {
        await sendAlertEmail(
          studentData.parent.email,
          "تحذير إهمال دراسي: عدم تسليم واجب",
          `عزيزي ولي الأمر، نحيطكم علماً بأن الطالب ${studentData.firstName} لم يقم بتسليم واجب (${homework.title}) في مادة ${homework.subject.name}. يرجى المتابعة.`
        );
      }
    }

    res.status(200).json({ success: true, message: "تم رصد الدرجة بنجاح", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getParentHomeworkDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    const allHomeworks = await Homework.find({ classroom: student.classroom })
      .populate("subject", "name")
      .populate("teacher", "firstName lastName");

    const studentResults = await HomeworkResult.find({ student: studentId })
      .populate("homework", "title totalMarks");

    const resultsMap = {};
    studentResults.forEach(res => {
      resultsMap[res.homework._id.toString()] = res;
    });

    const pendingHomeworks = [];
    const gradedHomeworks = [];

    const now = new Date();

    allHomeworks.forEach(hw => {
      const result = resultsMap[hw._id.toString()];

      if (result) {
        gradedHomeworks.push({
          homeworkDetails: hw,
          result: result
        });
      } else {
        if (hw.dueDate >= now) {
          pendingHomeworks.push(hw);
        } else {

        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        activeAssignments: pendingHomeworks, 
        historyAndResults: gradedHomeworks 
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};