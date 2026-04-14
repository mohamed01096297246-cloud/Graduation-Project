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
  },
  grade: {
    type: String,
    required: [true, "المرحلة الدراسية للمادة مطلوبة"],
    trim: true
  }
}, { timestamps: true });

subjectSchema.index({ name: 1, grade: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);