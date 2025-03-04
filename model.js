const mongoose = require("mongoose");

const CadetSchema = new mongoose.Schema({
    name: String,
    regNo: { type: String, unique: false }
});

const AttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    cadets: [{
        regNo: String,
        status: String
    }]
});

const Cadet = mongoose.model("Cadet", CadetSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = { Cadet, Attendance };
