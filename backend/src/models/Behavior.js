const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

    type: {
    type: String,
    enum: ["positive", "negative","bad"],
    required: true
  },

  note: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Behavior", behaviorSchema);
