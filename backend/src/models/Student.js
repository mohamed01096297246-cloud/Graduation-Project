const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  grade: {
    type: String, // like "Grade 1", "Grade 5", "Primary 3"
    required: true
  },

  classroom: {
    type: String, // Class name or number
    required: true
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  subjects: [
    {
      name: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
});

module.exports = mongoose.model("Student", studentSchema);
