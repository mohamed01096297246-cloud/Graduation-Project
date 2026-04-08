const Schedule = require("../models/Schedule");

exports.createSchedule = async (req, res) => {
  try {
    const { teacher, classroom, day, startTime, endTime } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "إدارة الجداول من صلاحيات الأدمن فقط" });
    }

    
    const conflict = await Schedule.findOne({
      day,
      startTime, 
      $or: [{ teacher }, { classroom }]
    });

    if (conflict) {
      return res.status(400).json({ 
        message: "يوجد تعارض! إما المدرس أو الفصل مشغول في هذا الوقت." 
      });
    }

    const schedule = await Schedule.create(req.body);
    res.status(201).json({ message: "تمت إضافة الحصة للجدول", schedule });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "حذف الحصص مقتصر على الأدمن" });
    }

    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: "الحصة غير موجودة" });

    res.json({ message: "تم حذف الحصة من الجدول بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCurrentClass = async (req, res) => {
  try {
    const now = new Date();
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const day = days[now.getDay()];

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const schedules = await Schedule.find({
      teacher: req.user.id, 
      day
    });

    const currentClass = schedules.find((sch) => {
      const [sh, sm] = sch.startTime.split(":").map(Number);
      const [eh, em] = sch.endTime.split(":").map(Number);

      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      return currentTime >= start && currentTime <= end;
    });

    if (!currentClass) {
      return res.status(404).json({ message: "لا يوجد حصص مسجلة لك في هذا الوقت" });
    }

    res.json(currentClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'teacher') {
      filter = { teacher: req.user.id };
    }

    const data = await Schedule.find(filter)
      .populate("teacher", "firstName lastName subject")
      .sort({ startTime: 1 }); 

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getTeacherSchedule = async (req, res) => {
  try {
    const data = await Schedule.find({ teacher: req.params.id }).populate("classroom").sort({ startTime: 1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getClassSchedule = async (req, res) => {
  try {
    const data = await Schedule.find({ classroom: req.params.classroom }).populate("teacher").sort({ startTime: 1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};