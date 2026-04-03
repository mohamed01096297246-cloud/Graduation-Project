const Homework = require("../models/Homework");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

exports.addHomework = async (req, res) => {
  try { 
    const { title, description, grade,classroom, subject, dueDate } = req.body;

    const homework = await Homework.create({
      title,
      description,
      grade,
      classroom,
      subject,
      dueDate,
      teacher: req.user._id
    });
    await Notification.create({
      title: "واجب جديد",
      message: `تم إضافة واجب جديد في مادة ${subject} لصف ${grade}.`,
      target: "all",
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Homework added successfully",
      homework
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getParentHomework = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id });
    
    const studentFilters = students.map(s => ({
      grade: s.grade,
      classroom: s.classroom
    }));

    const homework = await Homework.find({
      $or: studentFilters 
    }).sort({ createdAt: -1 });

    res.json(homework);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
