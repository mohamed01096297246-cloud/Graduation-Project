const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان الواجب مطلوب (مثال: تدريبات النحو)"],
      trim: true
    },
    pageNumber: {
      type: String,
      required: [true, "رقم الصفحة مطلوب (مثال: ص 45)"],
      trim: true
    },
    totalMarks: {
      type: Number,
      required: [true, "درجة الواجب مطلوبة"]
    },
    dueDate: {
      type: Date,
      required: [true, "تاريخ آخر موعد للتسليم مطلوب"]
    },
    // 🔥 السحر هنا: الواجب مربوط بالفصل كله
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true
    },
    // المدرس اللي عمل الواجب
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // المادة (هنسحبها أوتوماتيك من المدرس)
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    }
  },
  { timestamps: true } // دي بتعمل حقل createdAt (تاريخ اليوم) وحقل updatedAt لوحدها
);

module.exports = mongoose.model("Homework", homeworkSchema);