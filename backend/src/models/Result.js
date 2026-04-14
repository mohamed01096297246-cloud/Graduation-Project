const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam", // الربط بجدول الامتحانات (نصف العام / آخر العام)
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100 // الدرجة القصوى 100 كما طلبت
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// منع تكرار درجة نفس المادة لنفس الطالب في نفس الامتحان
resultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);