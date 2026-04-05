const sendCredentialsEmail = require("../utils/emailService");
const { generateUsername, generatePassword } = require("../utils/generateCredentials");
const Student = require("../models/Student");
const User = require("../models/User");

exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, nationalId, email } = req.body;

    if (!firstName || !lastName || !nationalId) {
      return res.status(400).json({ message: "First name, last name, and National ID are required" });
    }

    const existingUser = await User.findOne({ nationalId });
    if (existingUser) {
      return res.status(400).json({ message: "User with this National ID already exists" });
    }

    const username = generateUsername(`${firstName} ${lastName}`);
    const plainPassword = generatePassword();
    const admin = await User.create({
      firstName,
      lastName,
      phoneNumber,
      nationalId,
      email,
      role: "admin",
      username,
      password: plainPassword, 
      active: true
    });

    if (email) {
      await sendCredentialsEmail(email, username, plainPassword, "Admin");
    }

    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, username: admin.username, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const {
      firstName, lastName, phoneNumber, email, grade, gender, classroom, subjects,
      parentFirstName, parentLastName, parentPhoneNumber, parentNationalId, parentEmail
    } = req.body;

    if (!firstName || !lastName || !parentNationalId) {
      return res.status(400).json({ message: "Student names and Parent National ID are required" });
    }

    let parent = await User.findOne({ nationalId: parentNationalId, role: "parent" });
    let generatedUsername = null;
    let generatedPassword = null;

    if (!parent) {
      generatedUsername = generateUsername(`${parentFirstName} ${parentLastName}`);
      generatedPassword = generatePassword();

      parent = await User.create({
        firstName: parentFirstName,
        lastName: parentLastName,
        phoneNumber: parentPhoneNumber,
        nationalId: parentNationalId,
        email: parentEmail,
        role: "parent",
        username: generatedUsername,
        password: generatedPassword,
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
      subjects: subjects || [], 
      parent: parent._id
    });

    parent.linkedStudents.push(student._id);
    await parent.save();

    res.status(201).json({
      message: "Student created and linked to parent successfully",
      student,
      parentStatus: generatedUsername ? "New parent account created" : "Linked to existing parent"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, nationalId, email } = req.body;

    if (!firstName || !lastName || !nationalId) {
      return res.status(400).json({ message: "Names and National ID are required" });
    }

    const exists = await User.findOne({ nationalId });
    if (exists) {
      return res.status(400).json({ message: "Teacher with this National ID already exists" });
    }

    const username = generateUsername(`${firstName} ${lastName}`);
    const plainPassword = generatePassword();


    const teacher = await User.create({
      firstName,
      lastName,
      phoneNumber,
      nationalId,
      email,
      role: "teacher",
      username,
      password: plainPassword,
      active: true
    });

    if (email) {
      await sendCredentialsEmail(email, username, plainPassword, "Teacher");
    }

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: { id: teacher._id, username: teacher.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};