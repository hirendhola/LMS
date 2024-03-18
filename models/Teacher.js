const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true,
      minlength: 8
  },
  role: {
      type: String,
      enum: ['Teacher'],
      required: true
  },
  department: {
      type: String,
      required: true
  },
  subjectTaught: {
      type: String,
      required: true
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = { Teacher };
