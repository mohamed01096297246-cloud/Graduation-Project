const Student = require("../models/Student");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

// دالة لتوليد username عشوائي
function generateUsername(name) {
  const base = name.trim().toLowerCase().replace(/\s+/g, "");  
  const random = Math.floor(1000 + Math.random() * 9000);  
  return `${base}${random}`;  
}

// دالة لتوليد كلمة مرور عشوائية
function generatePassword() {
  return Math.random().toString(36).slice(-8) + "A1@";
}


exports.createStudent = async (req, res) => {
  try {
    const { studentName, grade, classroom, parentName, parentNationalId, parentEmail } = req.body;

    // 1) Check if parent exists
    let parent = await User.findOne({
      nationalId: parentNationalId,
      role: "parent"
    });

    let generatedUsername = null;
    let generatedPassword = null;

    // 2) If parent doesn't exist, create parent account
    if (!parent) {
      generatedUsername = generateUsername(parentName);
      generatedPassword = generatePassword();  
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      parent = await User.create({
        name: parentName,
        nationalId: parentNationalId,
        email: parentEmail || null,
        role: "parent",
        username: generatedUsername,
        password: hashedPassword,
        active: true,
      });
    }

    // 3) Create student
    const student = await Student.create({
      name: studentName,
      grade,
      classroom,
      parent: parent._id
    });

    
    parent.linkedStudents.push(student._id);
    await parent.save();

    return res.status(201).json({
      message: "Student and Parent saved successfully.",
      student,
      parentCredentials: generatedUsername
        ? { username: generatedUsername, password: generatedPassword }
        : "Parent already existed — no credentials sent."
    });

  } catch (err) {
    console.error("Error in createStudent:", err); 
    res.status(500).json({ error: err.message });
  }
};
