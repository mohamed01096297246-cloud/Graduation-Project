const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

subject: {
  type: String,
  required: true,
},

date: {
  type: Date,
  default: Date.now,
},

    type: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      required: true,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Behavior", behaviorSchema);