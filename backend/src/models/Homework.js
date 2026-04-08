const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: String,

    maxGrade: { 
      type: Number,
      required: true
    },

    classroom: {
      type: String,
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
    },

    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", homeworkSchema);