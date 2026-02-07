const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  phoneNumber:{
  type:String,
  require:true
  },

  grade: {
    type: String, 
    required: true
  },

  email:{
    type:String,
    require:true
  },

  classroom: {
    type: String, 
    required: true
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"//fk
  },

  subjects: [
    {
      name: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"//fk
      }
    }
  ]
});

module.exports = mongoose.model("Student", studentSchema)