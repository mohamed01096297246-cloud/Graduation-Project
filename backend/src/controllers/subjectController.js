const Subject = require("../models/Subject");
const User = require("../models/User"); 

exports.createSubject = async (req, res) => {
  try {
    const { name, code, grade } = req.body;
    
    const existingCode = await Subject.findOne({ code: code.trim().toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: "كود هذه المادة مسجل مسبقاً" });
    }

    const existingNameInGrade = await Subject.findOne({ name, grade });
    if (existingNameInGrade) {
      return res.status(400).json({ message: `مادة (${name}) مسجلة بالفعل لـ (${grade})` });
    }

    const subject = await Subject.create({ name, code, grade });
    res.status(201).json({ message: "تم إضافة المادة بنجاح", subject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    let filter = {};
    if (req.query.grade) {
      filter.grade = req.query.grade;
    }

    const subjects = await Subject.find(filter).sort({ grade: 1, name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, code, grade } = req.body;

    if (code || (name && grade)) {
      const query = { _id: { $ne: req.params.id } };
      if (code) query.code = code.trim().toUpperCase();
      
      const conflict = await Subject.findOne(query);
      if (conflict) {
        return res.status(400).json({ message: "البيانات الجديدة تتعارض مع مادة موجودة بالفعل" });
      }
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subject) return res.status(404).json({ message: "المادة غير موجودة" });
    res.json({ message: "تم تحديث المادة بنجاح", subject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "المادة غير موجودة" });

    const teachersCount = await User.countDocuments({ role: "teacher", subject: subject._id });
    
    if (teachersCount > 0) {
      return res.status(400).json({ 
        message: "لا يمكن حذف المادة لارتباطها بمعلمين في النظام. الرجاء تغيير مادة المعلمين أولاً." 
      });
    }

    await subject.deleteOne();
    res.json({ message: "تم حذف المادة بنجاح" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};