const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: String }],
    enrollmentDate: { type: Date, default: Date.now }
}, { timestamps: true });


const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
