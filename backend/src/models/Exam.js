const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  grade: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  term: {
    type: String,
    enum: ["midterm", "final"],
    required: true
  },

  totalMarks: {
    type: Number,
    required: true
  },

  date: Date

}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
