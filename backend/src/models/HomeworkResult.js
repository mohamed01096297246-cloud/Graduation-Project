const mongoose = require("mongoose");

const homeworkResultSchema = new mongoose.Schema(
  {
    homework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    // 🔥 فصلنا بين إنه سلم أو طنش
    status: {
      type: String,
      enum: ["submitted", "missing"], 
      required: true
    },
    // الدرجة (هتتحط بس لو الحالة submitted، حتى لو جاب 0)
    score: {
      type: Number,
      default: null
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // المدرس اللي صحح
      required: true
    }
  },
  { timestamps: true }
);

// منع تكرار النتيجة لنفس الطالب في نفس الواجب
homeworkResultSchema.index({ homework: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("HomeworkResult", homeworkResultSchema);