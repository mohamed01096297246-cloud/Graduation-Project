const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  grade: {
    type: String, 
    required: true
  },

  classroom: {
    type: String, 
    required: true
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"//fk
  },

  subjects: [
    {
      name: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"//fk
      }
    }
  ]
});

module.exports = mongoose.model("Student", studentSchema)