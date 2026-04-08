const Student = require("../models/Student");
const User = require("../models/User");
const Classroom = require("../models/Classroom");
const mongoose = require("mongoose");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");
const sendCredentialsEmail = require("../utils/emailService");

exports.createStudent = async (req, res) => {
  try {
    const {
      firstName, lastName, phoneNumber, email, gender, grade, classroom, subjects,
      parent, 
      parentFirstName, parentLastName, parentNationalId, parentEmail
    } = req.body;

    let finalParentId = parent;

    if (!finalParentId) {
      let existingParent = await User.findOne({ nationalId: parentNationalId });
      
      if (existingParent) {
        finalParentId = existingParent._id;
      } else {
        const fullName = `${parentFirstName || firstName} ${parentLastName || lastName}`;
        const generatedUser = generateUsername(fullName); 
        const generatedPass = generatePassword();        

        const newParent = await User.create({
          firstName: parentFirstName || lastName,
          lastName: parentLastName || "Family",
          nationalId: parentNationalId || Date.now().toString(),
          email: parentEmail,
          role: "parent",
          username: generatedUser,
          password: generatedPass, 
          active: true
        });

        finalParentId = newParent._id;

        if (parentEmail) {
          await sendCredentialsEmail(parentEmail, generatedUser, generatedPass, "ولي أمر");
        }
      }
    } else {
      const parentUser = await User.findById(finalParentId);
      if (!parentUser || parentUser.role !== "parent") {
        return res.status(400).json({ message: "ID ولي الأمر غير صحيح" });
      }
    }

    const student = await Student.create({
      firstName, lastName, phoneNumber, email, gender, grade, 
      classroom, parent: finalParentId, subjects
    });

    await User.findByIdAndUpdate(finalParentId, { $addToSet: { linkedStudents: student._id } });
    if (classroom) {
      await Classroom.findByIdAndUpdate(classroom, { $addToSet: { students: student._id } });
    }

    res.status(201).json({
      success: true,
      message: "تم إنشاء الطالب وحساب ولي الأمر وإرسال البيانات بنجاح",
      data: student
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (req.body.parent && req.body.parent !== student.parent.toString()) {
      const parentUser = await User.findById(req.body.parent);
      if (!parentUser || parentUser.role !== "parent") {
        return res.status(400).json({ message: "Invalid parent ID" });
      }
      await User.findByIdAndUpdate(student.parent, { $pull: { linkedStudents: student._id } });
      await User.findByIdAndUpdate(req.body.parent, { $addToSet: { linkedStudents: student._id } });
    }

    if (req.body.subjects) {
      for (let subj of req.body.subjects) {
        const teacher = await User.findById(subj.teacher);
        if (!teacher || teacher.role !== "teacher") {
          return res.status(400).json({ message: `Invalid teacher in subject: ${subj.name}` });
        }
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true, runValidators: true }
    ).populate("classroom parent"); 

    res.status(200).json({
      success: true,
      message: "تم تحديث بيانات الطالب بنجاح",
      data: updatedStudent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await User.findByIdAndUpdate(student.parent, {
      $pull: { linkedStudents: student._id }
    });

    if (student.classroom) {
      await Classroom.findByIdAndUpdate(student.classroom, {
        $pull: { students: student._id }
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "تم حذف الطالب وتحديث بيانات الفصل وولي الأمر بنجاح"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStudents = async (req, res) => {
  try {
    let students;

    if (req.user.role === "admin") {
      students = await Student.find()
        .populate("parent", "firstName lastName");
    }

    if (req.user.role === "teacher") {
      students = await Student.find({
        "subjects.teacher": req.user._id
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const student = await Student.findById(req.params.id)
      .populate("parent", "firstName lastName");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (
      req.user.role === "parent" &&
      student.parent.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "teacher") {
      const isTeacher = student.subjects.some(
        subj => subj.teacher.toString() === req.user._id.toString()
      );

      if (!isTeacher) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStudentsByParent = async (req, res) => {
  try {
    const parentId = req.params.parentId;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "Invalid parent ID" });
    }

    if (
      req.user.role === "parent" &&
      req.user._id.toString() !== parentId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await Student.find({ parent: parentId });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





