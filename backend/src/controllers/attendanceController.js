const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const Student = require("../models/Student");
const sendCredentialsEmail = require("../utils/emailService.js");
const User = require("../models/User");

// دالة مساعدة لتحويل الوقت (08:30) إلى دقائق (510) لسهولة المقارنة
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

exports.createAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "هذه الصلاحية للمعلمين فقط" });
    }

    const studentData = await Student.findById(student).populate("parent");
    if (!studentData) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    const normalizedDate = new Date(date || new Date());
    normalizedDate.setHours(0, 0, 0, 0);

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
        message: "لا يمكنك تسجيل الحضور الآن؛ لست في موعد حصتك الرسمية بهذا الفصل"
      });
    }

    const attendance = await Attendance.create({
      student,
      date: normalizedDate,
      status,
      recordedBy: req.user.id
    });

    if (status === "absent" && studentData.parent) {
      await sendCredentialsEmail(
        studentData.parent.email,
        "تنبيه غياب",
        `نحيطكم علماً بغياب الطالب: ${studentData.firstName} ${studentData.lastName} عن حصة ${activeClass.subject} اليوم.`
      );
    }

    res.status(201).json({ message: "تم تسجيل الحضور بنجاح", attendance });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "تم تسجيل حضور هذا الطالب بالفعل في هذا اليوم" });
    }
    res.status(500).json({ message: err.message });
  }
};
exports.getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("student")
      .populate("recordedBy", "name role");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({
      student: req.params.studentId
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};