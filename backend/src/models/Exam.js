const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان الامتحان مطلوب"],
      trim: true,
    },

    grade: {
      type: String,
      required: [true, "الصف الدراسي مطلوب"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "اسم المادة مطلوب"],
      trim: true,
    },

    term: {
      type: String,
      enum: {
        values: ["midterm", "final"],
        message: "نوع الترم يجب أن يكون midterm أو final",
      },
      required: true,
    },

    academicYear: {
      type: String,
      required: [true, "السنة الدراسية مطلوبة"],
      match: [/^\d{4}\/\d{4}$/, "يجب أن تكون السنة الدراسية بالشكل 2025/2026"],
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalMarks: {
      type: Number,
      required: [true, "الدرجة النهائية مطلوبة"],
      min: [0, "يجب أن تكون الدرجة النهائية قيمة موجبة"],
    },

    date: {
      type: Date,
      required: [true, "تاريخ الامتحان مطلوب"],
    },
  },
  { timestamps: true }
);

examSchema.index(
  { grade: 1, subject: 1, term: 1, date: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("Exam", examSchema);