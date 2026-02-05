const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true },
  nationalId: { type: String, required: true, unique: true },
  phoneNumber: { type: Int32Array, required: true, unique: true },
  email: String,
  role: {
    type: String,
    enum: ["admin", "teacher", "parent"],
    default: "parent",
  },
  password: { type: String, required: true },
  linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  active: { type: Boolean, default: true },
});

// HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
