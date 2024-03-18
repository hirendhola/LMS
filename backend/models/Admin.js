const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hodSchema = new Schema({
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
        enum: ['HOD'],
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }
});

const HOD = mongoose.model("HOD", hodSchema);
module.exports = HOD;
