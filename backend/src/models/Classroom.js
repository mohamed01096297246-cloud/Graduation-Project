const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم الفصل مطلوب"],
      trim: true,
    },

    grade: {
      type: String,
      required: [true, "الصف الدراسي مطلوب"],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, "السنة الدراسية مطلوبة"],
      trim: true,
      match: [/^\d{4}\/\d{4}$/, "يجب أن تكون السنة الدراسية بالشكل 2025/2026"],
    },
  },
  { timestamps: true }
);

classroomSchema.index(
  { name: 1, grade: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("Classroom", classroomSchema);