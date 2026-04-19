const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const Student = require("../models/Student");
const sendCredentialsEmail = require("../utils/emailService.js"); 

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const getActiveClass = async (teacherId, classroomId) => {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayName = days[new Date().getDay()];
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const schedules = await Schedule.find({
    teacher: teacherId,
    classroom: classroomId,
    day: dayName
  });

  return schedules.find((sch) => {
    const start = timeToMinutes(sch.startTime);
    const end = timeToMinutes(sch.endTime);
    return currentTime >= start && currentTime <= end;
  });
};

exports.recordBulkAttendance = async (req, res) => {
  try {
    const { classroomId, records } = req.body; 
    const activeClass = await getActiveClass(req.user.id, classroomId);

    if (!activeClass) {
      return res.status(403).json({ message: "انتهى وقت الحصة أو لم يبدأ بعد، لا يمكنك تسجيل الحضور الآن." });
    }

    const normalizedDate = new Date();
    normalizedDate.setHours(0, 0, 0, 0);


    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: { 
          student: record.student, 
          schedule: activeClass._id, 
          date: normalizedDate 
        },
        update: { 
          $set: { 
            status: record.status, 
            recordedBy: req.user.id 
          } 
        },
        upsert: true 
      }
    }));

    await Attendance.bulkWrite(bulkOps);

    const absents = records.filter(r => r.status === "absent");
    
    if (absents.length > 0) {
      const absentIds = absents.map(a => a.student);
      const studentsToNotify = await Student.find({ _id: { $in: absentIds } }).populate("parent");
      
      studentsToNotify.forEach(async (studentData) => {
        if (studentData.parent && studentData.parent.email) {
          try {
            await sendCredentialsEmail( 
              studentData.parent.email,
              "تنبيه غياب طالب",
              `نحيطكم علماً بغياب الطالب: ${studentData.firstName} عن حصة اليوم.`
            );
          } catch (e) {
            console.log("خطأ في إرسال إيميل الغياب:", e.message);
          }
        }
      });
    }

    res.status(201).json({ 
      success: true, 
      message: `تم تسجيل كشف الغياب لعدد (${records.length}) طالب بنجاح.` 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    if (req.user.role === 'parent' && student.parent.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "عفواً، لا يمكنك استعراض سجل غياب طالب ليس من أبنائك." 
      });
    }

    const data = await Attendance.find({ student: studentId })
      .populate({
        path: "schedule",
        populate: { path: "subject", select: "name" }
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllAttendance = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'teacher') {
      filter = { recordedBy: req.user.id };
    }

    const data = await Attendance.find(filter)
      .populate("student", "firstName lastName") 
      .populate({
        path: "schedule",
        populate: { path: "subject", select: "name" } 
      })
      .populate({
        path: "schedule",
        populate: { 
          path: "classroom", 
          select: "name grade",
          populate: { path: "grade", select: "name academicYear" } 
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("student", "firstName lastName")
     .populate({
        path: "schedule",
        populate: [
          { path: "subject", select: "name" },
          { 
            path: "classroom", 
            select: "name grade",
            populate: { path: "grade", select: "name academicYear" } 
          }
        ]
      });

    if (!attendance) return res.status(404).json({ message: "سجل الحضور غير موجود" });

    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate("student");
    if (!record) return res.status(404).json({ message: "السجل غير موجود" });

    const activeClass = await getActiveClass(req.user.id, record.student.classroom);

    if (!activeClass) {
      return res.status(403).json({ message: "عفواً، لا يمكنك تعديل الغياب بعد انتهاء وقت الحصة الرسمي." });
    }

    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "تم التعديل بنجاح", updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};