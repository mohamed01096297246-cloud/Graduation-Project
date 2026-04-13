const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    obtainedMarks: {
      type: Number,
      required: [true, "الدرجة مطلوبة"],
      min: [0, "الدرجة لا يمكن أن تكون سالبة"],
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);