const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./src/models/Student");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

Student.find()
  .then(students => {
    console.log("Students:", students);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });














 