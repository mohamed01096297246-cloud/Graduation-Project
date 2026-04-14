const Behavior = require("../models/Behavior");
const Student = require("../models/Student");
const Schedule = require("../models/Schedule");

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

exports.createBehavior = async (req, res) => {
  try {
    const { student, type, note } = req.body;

    const studentData = await Student.findById(student);
    if (!studentData) return res.status(404).json({ message: "الطالب غير موجود" });

    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayName = days[new Date().getDay()];
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const schedules = await Schedule.find({
      teacher: req.user.id,
      classroom: studentData.classroom,
      day: dayName
    });

    const activeClass = schedules.find((sch) => {
      const start = timeToMinutes(sch.startTime);
      const end = timeToMinutes(sch.endTime);
      return currentTimeInMinutes >= start && currentTimeInMinutes <= end;
    });

    if (!activeClass) {
      return res.status(403).json({
        message: "لا يمكنك تسجيل ملاحظة سلوكية الآن؛ لست في موعد حصتك الرسمية بهذا الفصل"
      });
    }

    const behavior = await Behavior.create({
      student,
      teacher: req.user.id,
      type, 
      note,
      subject: activeClass.subject, // السيرفر بيسحب المادة أوتوماتيك من الحصة
      date: new Date()
    });

    res.status(201).json({ success: true, message: "تم تسجيل السلوك بنجاح", behavior });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBehavior = async (req, res) => {
  try {
    let filter = {};
    // لو اللي بيطلب مدرس، نجيبله السلوك اللي هو بس كتبه
    if (req.user.role === 'teacher') {
      filter = { teacher: req.user.id };
    }

    const data = await Behavior.find(filter)
      .populate("student", "firstName lastName")
      .populate("teacher", "firstName lastName") // 🔥 تعديل الـ Name
      .populate("subject", "name") // 🔥 جلب اسم المادة
      .sort({ createdAt: -1 });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentBehavior = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 🔥 حماية ولي الأمر: لا يرى سوى أبنائه
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    if (req.user.role === 'parent' && student.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: "عفواً، لا يمكنك استعراض سجل طالب ليس من أبنائك." });
    }

    const data = await Behavior.find({ student: studentId })
      .populate("teacher", "firstName lastName")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBehavior = async (req, res) => {
  try {
    const behavior = await Behavior.findById(req.params.id);
    if (!behavior) return res.status(404).json({ message: "سجل السلوك غير موجود" });

    // 🔥 حماية: المدرس يقدر يمسح السجل اللي هو عمله بس، والأدمن يمسح أي حاجة
    if (req.user.role === 'teacher' && behavior.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "لا يمكنك حذف تقييم سلوكي كتبه معلم آخر" });
    }

    await behavior.deleteOne();
    res.json({ success: true, message: "تم حذف السجل بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};