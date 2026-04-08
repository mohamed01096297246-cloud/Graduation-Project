const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true 
    },

    grade: {
      type: String,
      required: true 
    }
  },
  { timestamps: true }
);

classroomSchema.index({ name: 1, grade: 1 }, { unique: true });

module.exports = mongoose.model("Classroom", classroomSchema);