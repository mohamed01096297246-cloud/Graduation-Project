const Homework = require("../models/Homework");
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const Student = require("../models/Student");

exports.createHomework = async (req, res) => {
  try {
    const { title, pageNumber, totalMarks, dueDate, classroomId } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "الفصل غير موجود" });
    }

    const teacher = await User.findById(req.user.id);

    if (!teacher.teachingGrades.includes(classroom.grade)) {
      return res.status(403).json({ message: "غير مصرح لك بإضافة واجب لهذا المستوى الدراسي." });
    }

    const homework = await Homework.create({
      title,
      pageNumber,
      totalMarks,
      dueDate,
      classroom: classroomId,
      teacher: req.user.id,
      subject: teacher.subject
    });

    res.status(201).json({
      success: true,
      message: "تم إرسال الواجب لجميع طلاب الفصل بنجاح",
      data: homework
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getStudentHomeworks = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    if (req.user.role === "parent" && student.parent.toString() !== req.user.id) {
      return res.status(403).json({ message: "غير مصرح لك باستعراض بيانات هذا الطالب." });
    }

    const homeworks = await Homework.find({ classroom: student.classroom })
      .populate("subject", "name") 
      .populate("teacher", "firstName lastName") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: homeworks.length,
      data: homeworks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};