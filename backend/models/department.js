// models/department.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hod: {
    type: Schema.Types.ObjectId,
    ref: 'HOD'
  }
});


const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
