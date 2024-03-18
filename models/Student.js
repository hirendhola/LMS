const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
        enum: ['Student'],
        required: true
    },
    enrollmentNumber: {
        type: Number,
        required: true,
        unique: true
    },
    department: {
        type: String,
    },
    mobilnumber: {
        type: Number,
        minlength: 10,
        maxlength: 10
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
