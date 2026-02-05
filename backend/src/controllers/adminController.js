const Student = require("../models/Student");
const User = require("../models/User");


function generateUsername(fullName) {
  const base = fullName.trim().toLowerCase().replace(/\s+/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
}


function generatePassword() {
  return Math.random().toString(36).slice(-8) + "A1@";
}

exports.createAdmin = async (req, res) => {
  try {
    const { fullName,phoneNumber,username, nationalId, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { nationalId }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

  
    const admin = await User.create({
      fullName,
      phoneNumber,
      username,
      nationalId,
      email,
      password, 
      role: "admin",
      active: true
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.fullName,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const {
      studentFullName,
      phoneNumber,
      email,
      grade,
      classroom,
      parentName,
      parentPhoneNumber,
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
        phonenumber:parentPhoneNumber,
        nationalId: parentNationalId,
        email: parentEmail || null,
        role: "parent",
        username: generatedUsername,
        password: generatedPassword 
      });
    }

    const student = await Student.create({
      name: studentFullName,
      phonenumber: phoneNumber,
      Email:email,
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

exports.createTeacher = async (req, res) => {
  try {
    const { fullName,phoneNumber, nationalId, email } = req.body;

    const exists = await User.findOne({ nationalId });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const username = generateUsername(name);
    const password = generatePassword();

    const teacher = await User.create({
      fullName,
      phoneNumber,
      nationalId,
      email,
      role: "teacher",
      username,
      password,
      active: true
    });

    res.status(201).json({
      message: "Teacher created successfully",
      credentials: {
        username,
        password
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

