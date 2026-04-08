const Behavior = require("../models/Behavior");

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

exports.createBehavior = async (req, res) => {
  try {
    const { student, type, note } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "هذه الصلاحية للمعلمين فقط" });
    }

    const studentData = await Student.findById(student).populate("parent");
    if (!studentData) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

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
      subject: activeClass.subject, 
      date: new Date()
    });

    
    res.status(201).json({
      message: "تم تسجيل السلوك بنجاح ",
      behavior
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllBehavior = async (req, res) => {
  try {
    const data = await Behavior.find()
      .populate("student")
      .populate("teacher", "name role");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentBehavior = async (req, res) => {
  try {
    const data = await Behavior.find({
      student: req.params.studentId
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBehavior = async (req, res) => {
  try {
    const behavior = await Behavior.findByIdAndDelete(req.params.id);

    if (!behavior) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};