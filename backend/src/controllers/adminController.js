const Student = require("../models/Student");
const User = require("../models/User");


function generateUsername(name) {
  const base = name.trim().toLowerCase().replace(/\s+/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
}


function generatePassword() {
  return Math.random().toString(36).slice(-8) + "A1@";
}

exports.createStudent = async (req, res) => {
  try {
    const {
      studentName,
      grade,
      classroom,
      parentName,
      parentNationalId,
      parentEmail
    } = req.body;

    let parent = await User.findOne({
      nationalId: parentNationalId,
      role: "parent"
    });

    let generatedUsername = null;
    let generatedPassword = null;

   
    if (!parent) {
      generatedUsername = generateUsername(parentName);
      generatedPassword = generatePassword();

      parent = await User.create({
        name: parentName,
        nationalId: parentNationalId,
        email: parentEmail || null,
        role: "parent",
        username: generatedUsername,
        password: generatedPassword 
      });
    }

    const student = await Student.create({
      name: studentName,
      grade,
      classroom,
      parent: parent._id
    });

    parent.linkedStudents.push(student._id);
    await parent.save();

    res.status(201).json({
      message: "Student and Parent created successfully",
      student,
      parentCredentials: generatedUsername
        ? { username: generatedUsername, password: generatedPassword }
        : "Parent already exists"
    });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};
