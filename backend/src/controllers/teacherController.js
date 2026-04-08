const User = require("../models/User");
const Schedule = require("../models/Schedule");
const Attendance = require("../models/Attendance");
const Homework = require("../models/Homework");
const sendCredentialsEmail = require("../utils/emailService");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");


const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};


exports.createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, nationalId, email, subject, assignedClassrooms } = req.body;

    const username = generateUsername(`${firstName} ${lastName}`);
    const password = generatePassword(); 

    const teacher = await User.create({
      firstName, lastName, phoneNumber, nationalId, email,
      role: "teacher",
      subject, 
      assignedClassrooms, 
      username, password,
      active: true
    });

    if (email) await sendCredentialsEmail(email, username, password, "Teacher");
    res.status(201).json({ message: "Teacher created", teacher });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "هذه اللوحة مخصصة للمعلمين فقط" });
    }

    const teacherId = req.user.id;

    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const now = new Date();
    const day = days[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayClasses = await Schedule.find({
      teacher: teacherId,
      day
    })
    .populate("classroom", "name grade")
    .sort({ startTime: 1 }); 
    const currentClass = todayClasses.find((cls) => {
      const start = timeToMinutes(cls.startTime);
      const end = timeToMinutes(cls.endTime);
      return currentTime >= start && currentTime <= end;
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceToday = await Attendance.find({
      recordedBy: teacherId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate("student", "firstName lastName");

    const absentStudents = attendanceToday
      .filter(a => a.status === "absent")
      .map(a => ({
        id: a.student._id,
        name: `${a.student.firstName} ${a.student.lastName}`, 
        date: a.date
      }));


    const homeworks = await Homework.find({
      teacher: teacherId
    })
    .populate("classroom", "name grade")
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      summary: {
        totalClassesToday: todayClasses.length,
        totalAbsentsRecorded: absentStudents.length
      },
      todayClasses,
      currentClass: currentClass || null,
      absentStudents,
      recentHomeworks: homeworks
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};