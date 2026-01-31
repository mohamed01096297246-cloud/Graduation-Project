const mongoose = require("mongoose");

const homeworkResultSchema = new mongoose.Schema({
  homework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Homework",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  marks: {
    type: Number,
    required: true
  },

  feedback: {
    type: String
  },

  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("HomeworkResult", homeworkResultSchema);
