const mongoose = require("mongoose");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");
const sendCredentialsEmail = require("../utils/emailService");
const User = require("../models/User");
const Student = require("../models/Student");
const Classroom = require("../models/Classroom"); 

exports.createStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      firstName, lastName, phoneNumber, email, gender, grade, 
      parentFirstName, parentLastName, parentNationalId, parentEmail, parentPhone 
    } = req.body;

    const availableClassroom = await Classroom.findOne({
      grade: grade,
      $expr: { $lt: ["$currentStudents", "$capacity"] }
    }).session(session);

if (!availableClassroom) {
      throw new Error("عفواً، لا توجد فصول متاحة حالياً في هذه المرحلة الدراسية. يرجى إنشاء فصل جديد أولاً.");
    }  

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
      parent: finalParentId,
      classroom: availableClassroom._id 
    }], { session });

    const student = studentResult[0];

    await Classroom.findByIdAndUpdate(
      availableClassroom._id, 
      { $inc: { currentStudents: 1 } }, 
      { session }
    );

    await User.findByIdAndUpdate(finalParentId, { $addToSet: { linkedStudents: student._id } }, { session });
    
    if (isNewParent && parentEmail) {
      try {
        await sendCredentialsEmail(parentEmail, generatedUser, generatedPass, "ولي أمر");
      } catch (emailErr) {
        throw new Error("تعذر إرسال بيانات الدخول لولي الأمر. تم إلغاء عملية تسجيل الطالب. السبب: " + emailErr.message);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: isNewParent 
        ? `تم إنشاء الطالب وتوزيعه تلقائياً على فصل (${availableClassroom.name}) وإرسال بيانات الدخول للأب بنجاح.` 
        : `تم إنشاء الطالب وتوزيعه على فصل (${availableClassroom.name}) وربطه بحساب ولي الأمر الحالي.`,
      data: student
    });

  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
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
    let students = [];
    const { classroomId } = req.query; 

    if (req.user.role === "admin") {

      let filter = {};
      if (classroomId) filter.classroom = classroomId;
      students = await Student.find(filter).populate("parent", "firstName lastName");
    } 
    
    else if (req.user.role === "teacher") {
      if (!classroomId) {
        return res.status(400).json({ message: "برجاء تحديد الفصل أولاً لعرض قائمة الطلاب." });
      }
      
students = await Student.find(filter)
        .populate("parent", "firstName lastName")
        .populate("grade", "name academicYear") 
        .populate("classroom", "name");
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
      .populate("parent", "firstName lastName")
      .populate("grade", "name academicYear") 
      .populate("classroom", "name"); 

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

const students = await Student.find({ parent: parentId })
      .populate("grade", "name academicYear") 
      .populate("classroom", "name"); 

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};