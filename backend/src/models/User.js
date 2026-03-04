const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  // middleName:{ type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  nationalId: { type: String, required: true, unique: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true },
  role: {
    type: String,
    enum: ["admin", "teacher", "parent"],
    default: "parent",
  },
  username: { type: String, unique: true, trim: true },
  password: { type: String, required: true },
  linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  active: { type: Boolean, default: true },
});

// HASH PASSWORD (مرة واحدة فقط هنا)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password.trim(), 10);
  
});

module.exports = mongoose.model("User", userSchema);
