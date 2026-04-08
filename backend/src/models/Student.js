const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },

classroom: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Classroom",
  required: true
},

parent: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

subjects: [
{
name:{
          type: String,
          required: true,
        },

        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);