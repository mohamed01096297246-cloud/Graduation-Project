const mongoose = require("mongoose");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");
const sendCredentialsEmail = require("../utils/emailService");
const User = require("../models/User");
const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      firstName, lastName, phoneNumber, email, gender, grade, 
      parentFirstName, parentLastName, parentNationalId, parentEmail, parentPhone 
    } = req.body;

    if (!parentNationalId) {
      throw new Error("الرقم القومي لولي الأمر مطلوب للتحقق من هويته");
    }

    let finalParentId;
    let isNewParent = false;
    let generatedUser, generatedPass;

    let existingParent = await User.findOne({ nationalId: parentNationalId, role: "parent" }).session(session);

    if (existingParent) {
      finalParentId = existingParent._id;
    } else {
      if (!parentPhone) {
        throw new Error("رقم هاتف ولي الأمر مطلوب لإنشاء حساب جديد");
      }

      const fullName = `${parentFirstName || firstName} ${parentLastName || lastName}`;
      generatedUser = generateUsername(fullName); 
      generatedPass = generatePassword();        

      const newParentResult = await User.create([{
        firstName: parentFirstName || lastName,
        lastName: parentLastName || "Family",
        nationalId: parentNationalId,
        phoneNumber: parentPhone,
        email: parentEmail,
        role: "parent",
        username: generatedUser,
        password: generatedPass, 
        active: true
      }], { session });

      finalParentId = newParentResult[0]._id;
      isNewParent = true;
    }

    const studentResult = await Student.create([{
      firstName, lastName, phoneNumber, email, gender, grade, 
      parent: finalParentId 
    }], { session });

    const student = studentResult[0];

    await User.findByIdAndUpdate(finalParentId, { $addToSet: { linkedStudents: student._id } }, { session });
    
    await session.commitTransaction();
    session.endSession();

    if (isNewParent && parentEmail) {
      await sendCredentialsEmail(parentEmail, generatedUser, generatedPass, "ولي أمر");
    }

    res.status(201).json({
      success: true,
      message: isNewParent 
        ? "تم إنشاء الطالب وحساب ولي الأمر وإرسال بيانات الدخول بنجاح" 
        : "تم إنشاء الطالب وربطه بحساب ولي الأمر الحالي بنجاح",
      data: student
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message }); 
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

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true, runValidators: true }
    ).populate("parent"); 

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


    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "تم حذف الطالب وتحديث بيانات ولي الأمر بنجاح"
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

      students = []; 
    }

    res.status(200).json({
      success: true,
      count: students?.length || 0,
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
        return res.status(403).json({ message: "المعلم لا يملك صلاحية استعراض ملف الطالب مباشرة في هذا التحديث" });
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