exports.getParentDashboard = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user.id }).populate("classroom", "name grade");

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على طلاب مرتبطين بهذا الحساب" });
    }

    const childrenData = await Promise.all(students.map(async (student) => {
      
      const attendance = await Attendance.find({ student: student._id });
      const present = attendance.filter(a => a.status === "present").length;
      const absent = attendance.filter(a => a.status === "absent").length;

      const behaviors = await Behavior.find({ student: student._id })
        .populate("teacher", "firstName lastName")
        .sort({ createdAt: -1 });

      const homeworkResults = await HomeworkResult.find({ student: student._id })
        .populate("homework", "title subject")
        .sort({ createdAt: -1 });

      const examResults = await Result.find({ student: student._id })
        .populate("exam", "title subject totalMarks")
        .sort({ createdAt: -1 });

      return {
        studentInfo: {
          id: student._id,
          fullName: `${student.firstName} ${student.lastName}`,
          classroom: student.classroom ? student.classroom.name : "غير محدد",
          grade: student.classroom ? student.classroom.grade : ""
        },
        attendance: { present, absent, totalDays: attendance.length },
        behaviors,
        homeworkResults,
        examResults
      };
    }));

    res.json({
      parentName: req.user.firstName,
      children: childrenData
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};