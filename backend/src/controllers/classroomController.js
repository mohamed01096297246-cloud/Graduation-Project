const Classroom = require("../models/Classroom");

exports.createClassroom = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "عفواً، إنشاء الفصول من صلاحيات الإدارة فقط" });
    }

    const existingClass = await Classroom.findOne({ name: req.body.name, grade: req.body.grade });
    if (existingClass) {
      return res.status(400).json({ message: "هذا الفصل مسجل بالفعل في هذه السنة الدراسية" });
    }

    const classroom = await Classroom.create(req.body);
    res.status(201).json({ message: "تم إنشاء الفصل بنجاح", classroom });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllClassrooms = async (req, res) => {
  try {
    const data = await Classroom.find().sort({ grade: 1, name: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "تعديل بيانات الفصول مقتصر على الإدارة" });
    }

    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classroom) return res.status(404).json({ message: "الفصل غير موجود" });

    res.json({ message: "تم تحديث بيانات الفصل بنجاح", classroom });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "حذف الفصول من صلاحيات الأدمن فقط" });
    }

    const classroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!classroom) return res.status(404).json({ message: "الفصل غير موجود" });

    res.json({ message: "تم حذف الفصل بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate("students");

    if (!classroom) {
      return res.status(404).json({ message: "عفواً، هذا الفصل غير موجود" });
    }

    res.json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};