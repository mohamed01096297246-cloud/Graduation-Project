const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true
  },

  day: {
    type: String,
    enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    required: true
  },

  period: {
    type: Number,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
