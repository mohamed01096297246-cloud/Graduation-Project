const Subject = require("../models/Subject");
const User = require("../models/User"); 

exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    const existingSubject = await Subject.findOne({ code: code.trim().toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: "كود هذه المادة مسجل مسبقاً" });
    }

    const subject = await Subject.create({ name, code });
    res.status(201).json({ message: "تم إضافة المادة بنجاح", subject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "المادة غير موجودة" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    if (req.body.code) {
      const existingSubject = await Subject.findOne({ 
        code: req.body.code.trim().toUpperCase(), 
        _id: { $ne: req.params.id } 
      });
      if (existingSubject) {
        return res.status(400).json({ message: "كود هذه المادة مسجل مسبقاً لمادة أخرى" });
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