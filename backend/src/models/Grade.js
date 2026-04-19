const mongoose=require("mongoose");

const gradeSchema=new mongoose.Schema({
      name: {
    type: String,
    required: [true, "اسم المستوي مطلوب"],
    trim: true 
  },
  
  academicYear: {
      type: String,
      required: [true, "السنة الدراسية مطلوبة"],
      trim: true,
      match: [/^\d{4}\/\d{4}$/, "يجب أن تكون السنة الدراسية بالشكل 2025/2026"],
    },

}
)
module.exports = mongoose.model("Grade", gradeSchema);