const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  classroom: {
    type: String,
    required: true
  },

  day: {
    type: String,
    enum: ["sat", "sun", "mon", "tue", "wed", "thu"],
    required: true
  },

  startTime: {
    type: String, 
    required: true
  },

  endTime: {
    type: String, 
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);