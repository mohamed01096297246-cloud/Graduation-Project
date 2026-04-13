const Homework = require("../models/Homework");
const Student = require("../models/Student");
const sendCredentialsEmail = require("../utils/emailService"); 

exports.createHomework = async (req, res) => {
  try {
    const { title, description, subject, grade, classroom, dueDate, maxGrade } =
      req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "المعلمين فقط" });
    }

    if (req.user.subject && subject !== req.user.subject) {
      return res.status(403).json({
        message: `غير مسموح لك بمادة ${subject}`,
      });
    }

    if (
      req.user.assignedClassrooms &&
      !req.user.assignedClassrooms.includes(classroom)
    ) {
      return res.status(403).json({
        message: "هذا الفصل غير تابع لك",
      });
    }

    const homework = await Homework.create({
      title,
      description,
      subject,
      grade,
      classroom,
      dueDate,
      maxGrade,
      teacher: req.user.id,
    });

    const students = await Student.find({ classroom, grade }).populate("parent");

    for (const student of students) {
      if (student.parent?.email) {
        await sendCredentialsEmail(
          student.parent.email,
          "واجب جديد",
          `تم إضافة واجب جديد في مادة ${subject}`
        );
      }
    }

    res.status(201).json({
      message: "تم إنشاء الواجب بنجاح",
      homework,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllHomework = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter = { teacher: req.user.id };
    }

    if (req.user.role === "parent") {
      const students = await Student.find({ parent: req.user.id });
      const classrooms = students.map((s) => s.classroom);
      filter = { classroom: { $in: classrooms } };
    }

    const data = await Homework.find(filter)
      .populate("teacher", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHomework = async (req, res) => {
  try {
    const hw = await Homework.findById(req.params.id).populate(
      "teacher",
      "firstName lastName"
    );

    if (!hw) {
      return res.status(404).json({ message: "غير موجود" });
    }

    if (req.user.role === "parent") {
      const allowed = await Student.findOne({
        parent: req.user.id,
        classroom: hw.classroom,
      });

      if (!allowed) {
        return res.status(403).json({ message: "غير مسموح" });
      }
    }

    res.json(hw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHomework = async (req, res) => {
  try {
    const hw = await Homework.findById(req.params.id);

    if (!hw) {
      return res.status(404).json({ message: "غير موجود" });
    }

    if (req.user.role !== "teacher" && hw.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح" });
    }

    const updated = await Homework.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const hw = await Homework.findById(req.params.id);

    if (!hw) {
      return res.status(404).json({ message: "غير موجود" });
    }

    if (req.user.role !== "teacher" && hw.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح" });
    }

    await hw.deleteOne();

    res.json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};