const Homework = require("../models/Homework");
const Student = require("../models/Student"); 

exports.createHomework = async (req, res) => {
  try {
    const { title, description, subject, grade, classroom, dueDate } = req.body;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "هذه الصلاحية للمعلمين فقط" });
    }

    if (subject !== req.user.subject) {
      return res.status(403).json({ 
        message: `غير مسموح لك بإضافة واجب في مادة ${subject}؛ تخصصك المسجل هو ${req.user.subject}` 
      });
    }

    if (!req.user.assignedClassrooms.includes(classroom)) {
      return res.status(403).json({ 
        message: "هذا الفصل ليس من ضمن الفصول المكلف بتدريسها" 
      });
    }

    const homework = await Homework.create({
      title,
      description,
      subject,
      grade,
      classroom,
      dueDate,
      teacher: req.user.id 
    });

   
    const students = await Student.find({ classroom, grade }).populate("parent");
    students.forEach(student => {
       if(student.parent) {
         sendEmail(student.parent.email, "واجب جديد", `تم إضافة واجب جديد في مادة ${subject}`);
       }
    });
    

    res.status(201).json({
      message: "تم إضافة الواجب بنجاح",
      homework
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllHomework = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'teacher') {
      filter = { teacher: req.user.id }; 
    } else if (req.user.role === 'parent') {
      const students = await Student.find({ parent: req.user.id });
      const classrooms = students.map(s => s.classroom);
      filter = { classroom: { $in: classrooms } };
    }

    const data = await Homework.find(filter).populate("teacher", "firstName lastName");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHomework = async (req, res) => {
  try {
    const hw = await Homework.findById(req.params.id).populate("teacher", "firstName lastName");

    if (!hw) return res.status(404).json({ message: "Not found" });

    if (req.user.role === 'parent') {
      const isHisChildClass = await Student.findOne({ parent: req.user.id, classroom: hw.classroom });
      if (!isHisChildClass) {
        return res.status(403).json({ message: "لا يمكنك رؤية واجبات فصول أخرى" });
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

    if (!hw) return res.status(404).json({ message: "الواجب غير موجود" });

    if (req.user.role !== 'admin' && hw.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح لك بتعديل واجب مدرسة أخرى" });
    }

    const updatedHw = await Homework.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedHw);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const hw = await Homework.findById(req.params.id);

    if (!hw) return res.status(404).json({ message: "الواجب غير موجود" });

    if (req.user.role !== 'admin' && hw.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مسموح لك بحذف هذا الواجب" });
    }

    await hw.deleteOne();
    res.json({ message: "تم حذف الواجب بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};