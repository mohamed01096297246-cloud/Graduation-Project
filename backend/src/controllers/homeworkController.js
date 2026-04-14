const Homework = require("../models/Homework");
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const Student = require("../models/Student");

// 1. إنشاء واجب جديد (للمعلمين فقط)
exports.createHomework = async (req, res) => {
  try {
    // المدرس بيبعت دول بس من الفرونت إند
    const { title, pageNumber, totalMarks, dueDate, classroomId } = req.body;

    // التأكد من وجود الفصل
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "الفصل غير موجود" });
    }

    // جلب بيانات المدرس عشان نسحب منها المادة
    const teacher = await User.findById(req.user.id);

    // 🔥 حماية: هل المدرس مسموح له يدرس المستوى بتاع الفصل ده؟
    if (!teacher.teachingGrades.includes(classroom.grade)) {
      return res.status(403).json({ message: "غير مصرح لك بإضافة واجب لهذا المستوى الدراسي." });
    }

    const homework = await Homework.create({
      title,
      pageNumber,
      totalMarks,
      dueDate,
      classroom: classroomId,
      teacher: req.user.id,
      subject: teacher.subject // سحبنا المادة أوتوماتيك!
    });

    res.status(201).json({
      success: true,
      message: "تم إرسال الواجب لجميع طلاب الفصل بنجاح",
      data: homework
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 2. عرض الواجبات لولي الأمر (ذكية جداً)
exports.getStudentHomeworks = async (req, res) => {
  try {
    const { studentId } = req.params;

    // نجيب الطالب الأول عشان نعرف هو في فصل إيه
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    // 🔥 حماية الخصوصية: التأكد إن اللي بيطلب هو أبو الطالب فعلاً
    if (req.user.role === "parent" && student.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مصرح لك باستعراض بيانات هذا الطالب." });
    }

    // 🔥 السحر: هنجيب كل الواجبات اللي مربوطة بـ (فصل الطالب) ده
    const homeworks = await Homework.find({ classroom: student.classroom })
      .populate("subject", "name") // نجيب اسم المادة (عربي، رياضة..)
      .populate("teacher", "firstName lastName") // اسم المدرس
      .sort({ createdAt: -1 }); // الترتيب من الأحدث للأقدم

    res.status(200).json({
      success: true,
      count: homeworks.length,
      data: homeworks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};