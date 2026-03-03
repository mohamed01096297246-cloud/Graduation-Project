const bcrypt = require("bcryptjs");
const sendCredentialsEmail = require("../utils/emailService");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");

const Student = require("../models/Student");
const User = require("../models/User");


exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, nationalId, email } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and last name are required" });
    }

    const existingUser = await User.findOne({ nationalId });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const username = generateUsername(`${firstName} ${lastName}`);
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await User.create({
      firstName,
      lastName,
      phoneNumber,
      nationalId,
      email,
      role: "admin",
      username,
      password: hashedPassword,
      active: true
    });

    if (email) {
      await sendCredentialsEmail(email, username, plainPassword, "Admin");
    }

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        fullName: `${admin.firstName} ${admin.lastName}`,
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

    if (!firstName || !lastName || !parentFirstName || !parentLastName) {
      return res.status(400).json({ message: "Student and Parent names are required" });
    }

    let parent = await User.findOne({
      nationalId: parentNationalId,
      role: "parent"
    });

    let generatedUsername = null;
    let generatedPassword = null;

    if (!parent) {
      generatedUsername = generateUsername(`${parentFirstName} ${parentLastName}`);
      generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      parent = await User.create({
        firstName: parentFirstName,
        lastName: parentLastName,
        phoneNumber: parentPhoneNumber,
        nationalId: parentNationalId,
        email: parentEmail,
        role: "parent",
        username: generatedUsername,
        password: hashedPassword,
        active: true,
        linkedStudents: []
      });

      if (parentEmail) {
        await sendCredentialsEmail(parentEmail, generatedUsername, generatedPassword, "Parent");
      }
    }

    const student = await Student.create({
      firstName,
      lastName,
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
      parentAccount: generatedUsername
        ? "Parent account created and credentials sent"
        : "Parent already exists"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, nationalId, email } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and last name are required" });
    }

    const exists = await User.findOne({ nationalId });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const username = generateUsername(`${firstName} ${lastName}`);
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
      await sendCredentialsEmail(email, username, plainPassword, "Teacher");
    }

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: {
        id: teacher._id,
        fullName: `${teacher.firstName} ${teacher.lastName}`,
        username: teacher.username,
        role: teacher.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};