const HomeworkResult = require("../models/HomeworkResult");
const Homework = require("../models/Homework");
const Student = require("../models/Student");
const { sendAlertEmail } = require("../utils/emailService"); // دالة الإيميل اللي اتفقنا عليها

exports.gradeHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const { studentId, status, score, teacherFeedback } = req.body;

    const homework = await Homework.findById(homeworkId);
    if (!homework) return res.status(404).json({ message: "الواجب غير موجود" });

    // التأكد إن المدرس ده هو صاحب الواجب
    if (homework.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مصرح لك بتصحيح هذا الواجب" });
    }

    // حفظ النتيجة (أو تحديثها لو متسجلة قبل كده)
    const result = await HomeworkResult.findOneAndUpdate(
      { homework: homeworkId, student: studentId },
      { 
        status, 
        score: status === "missing" ? 0 : score, // لو مسلمش هنحفظه صفر برمجياً بس الحالة هتفضل missing
        teacherFeedback, 
        gradedBy: req.user.id 
      },
      { new: true, upsert: true } // upsert بتعمل إنشاء لو مش موجود
    );

    // 🔥 لو الطالب لم يسلم الواجب، نبعت تحذير لولي الأمر فوراً
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

    // 1. نجيب كل الواجبات بتاعة الفصل ده
    const allHomeworks = await Homework.find({ classroom: student.classroom })
      .populate("subject", "name")
      .populate("teacher", "firstName lastName");

    // 2. نجيب كل النتائج اللي اتسجلت للطالب ده
    const studentResults = await HomeworkResult.find({ student: studentId })
      .populate("homework", "title totalMarks");

    // تحويل النتائج لـ Dictionary عشان البحث يكون أسرع
    const resultsMap = {};
    studentResults.forEach(res => {
      resultsMap[res.homework._id.toString()] = res;
    });

    // 3. تقسيم البيانات (الذكاء هنا)
    const pendingHomeworks = [];
    const gradedHomeworks = [];

    const now = new Date();

    allHomeworks.forEach(hw => {
      const result = resultsMap[hw._id.toString()];

      if (result) {
        // لو المدرس صححه، يروح في قسم النتائج
        gradedHomeworks.push({
          homeworkDetails: hw,
          result: result
        });
      } else {
        // لو لسه متصححش
        if (hw.dueDate >= now) {
          // ولسه ميعاده مجاش، يبقى مطلوب حله
          pendingHomeworks.push(hw);
        } else {
          // لو ميعاده فات والمدرس لسه مصححهوش (اختياري تعرضها أو تخفيها)
          // ممكن نحطها في قسم (متأخر)
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        // القسم اللي فوق في الشاشة (مطلوب حله)
        activeAssignments: pendingHomeworks, 
        // القسم اللي تحت في الشاشة (تم التصحيح / أو لم يسلم)
        historyAndResults: gradedHomeworks 
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};