const Classroom = require("../models/Classroom");
const Student = require("../models/Student");
const Schedule = require("../models/Schedule");

exports.createClassroom = async (req, res) => {
  try {
    const { name, grade, academicYear } = req.body;

    const existingClass = await Classroom.findOne({
      name,
      grade,
      academicYear,
    });

    if (existingClass) {
      return res.status(400).json({
        message: "هذا الفصل مسجل بالفعل في هذه السنة الدراسية",
      });
    }

    const classroom = await Classroom.create({
      name,
      grade,
      academicYear,
    });

    res.status(201).json({
      message: "تم إنشاء الفصل بنجاح",
      classroom,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "هذا الفصل مسجل بالفعل",
      });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getAllClassrooms = async (req, res) => {
  try {
    const data = await Classroom.find().sort({
      academicYear: -1,
      grade: 1,
      name: 1,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        message: "عفواً، هذا الفصل غير موجود",
      });
    }

    const students = await Student.find({
      classroom: classroom._id,
    }).select("firstName lastName");

    res.json({
      ...classroom.toObject(),
      students,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const { name, grade, academicYear } = req.body;

    const existingClass = await Classroom.findOne({
      name,
      grade,
      academicYear,
      _id: { $ne: req.params.id },
    });

    if (existingClass) {
      return res.status(400).json({
        message: "يوجد فصل آخر بنفس البيانات في هذه السنة الدراسية",
      });
    }

    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { name, grade, academicYear },
      { new: true, runValidators: true }
    );

    if (!classroom) {
      return res.status(404).json({
        message: "الفصل غير موجود",
      });
    }

    res.json({
      message: "تم تحديث بيانات الفصل بنجاح",
      classroom,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        message: "الفصل غير موجود",
      });
    }

    const studentsCount = await Student.countDocuments({
      classroom: classroom._id,
    });

    if (studentsCount > 0) {
      return res.status(400).json({
        message: "لا يمكن حذف الفصل لارتباطه بطلاب",
      });
    }

    const schedulesCount = await Schedule.countDocuments({
      classroom: classroom._id,
    });

    if (schedulesCount > 0) {
      return res.status(400).json({
        message: "لا يمكن حذف الفصل لارتباطه بالجدول الدراسي",
      });
    }

    await classroom.deleteOne();

    res.json({
      message: "تم حذف الفصل بنجاح",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};