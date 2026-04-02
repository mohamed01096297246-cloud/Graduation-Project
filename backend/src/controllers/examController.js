const Exam = require("../models/Exam");
const Student = require("../models/Student"); 


exports.createExam = async (req, res) => {
  try {
    const { title, grade, subject, term, totalMarks, date } = req.body;

    const exam = await Exam.create({
      title,
      grade,
      subject,
      term,
      totalMarks,
      date
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExamsByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    
    const exams = await Exam.find({ grade }).sort({ date: 1 }); 
    
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getParentExams = async (req, res) => {
  try {
    
    const students = await Student.find({ parent: req.user._id });
    
   
    const grades = [...new Set(students.map(s => s.grade))];

    if (grades.length === 0) return res.json([]);

    const exams = await Exam.find({
      grade: { $in: grades }
    }).sort({ date: 1 }); 

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
