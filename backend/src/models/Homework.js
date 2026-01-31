const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
  title: String,

  description: String,

  grade: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  dueDate: Date

}, { timestamps: true });

module.exports = mongoose.model("Homework", homeworkSchema);
