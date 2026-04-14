const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان الامتحان مطلوب (مثال: امتحانات نصف العام)"],
      trim: true
    },
    academicYear: {
      type: String,
      required: [true, "السنة الدراسية مطلوبة (مثال: 2025/2026)"],
      trim: true
    },
    grade: {
      type: String,
      required: [true, "المستوى الدراسي مطلوب (مثال: الصف الأول)"],
      trim: true
    },
    
    timetable: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true
        },
        date: {
          type: Date,
          required: true
        },
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);