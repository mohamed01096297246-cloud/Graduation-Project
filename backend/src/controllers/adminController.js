const bcrypt = require("bcryptjs");
const sendCredentialsEmail = require("../utils/emailService");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");

const Student = require("../models/Student");
const User = require("../models/User");

exports.createAdmin = async (req, res) => {
  try {
    const { firstName,lastName,phoneNumber,username, nationalId, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { nationalId }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

  
    const admin = await User.create({
      firstName,
      lastName,
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
        name: admin.firstName,lastName,
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
      firstName,
      lastName,
      phoneNumber,
      email,
      grade,
      gender,
      classroom,
      parentFirstName,
      parentLastName,
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

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      parent = await User.create({
        firstName: parentFirstName,
        lastName:parentLastName,
        phoneNumber: parentPhoneNumber,
        nationalId: parentNationalId,
        email: parentEmail,
        role: "parent",
        username: generatedUsername,
        password: hashedPassword,
        active: true
      });


      if (parentEmail) {
        await sendCredentialsEmail(
          parentEmail,
          generatedUsername,
          generatedPassword,
          "Parent"
        );
      }
    }

    const student = await Student.create({
      firstName: firstName,
      lasttName:lastName,
      phoneNumber,
      email,
      grade,
      classroom,
      gender,
      parent: parent._id
    });

    parent.linkedStudents.push(student._id);
    await parent.save();

    res.status(201).json({
      message: "Student created successfully",
      student,
      parentAccount:
        generatedUsername
          ? "Parent account created and credentials sent to email"
          : "Parent already exists"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.createTeacher = async (req, res) => {
  try {
    const { firstName,lastName, phoneNumber, nationalId, email } = req.body;

    const exists = await User.findOne({ nationalId });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const username = generateUsername(firstName,lastName);
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const teacher = await User.create({
      firstName,
      lastName,
      phoneNumber,
      nationalId,
      email,
      role: "teacher",
      username,
      password: hashedPassword,
      active: true
    });

    if (email) {
      await sendCredentialsEmail(
        email,
        username,
        plainPassword,
        "Teacher"
      );
    }

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: {
        id: teacher._id,
        fullName: teacher.firstName.lastName,
        username: teacher.username,
        role: teacher.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

