const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "اسم المادة مطلوب"],
    trim: true 
  },
  code: {
    type: String,
    required: [true, "كود المادة مطلوب"],
    unique: true,
    trim: true,
    uppercase: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);