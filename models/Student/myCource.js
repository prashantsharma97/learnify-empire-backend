const mongoose = require("mongoose");

const myCourseSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 }, 
    completedLessons: [{ type: String }] 
}, { timestamps: true });

const MyCourse = mongoose.model("MyCourse", myCourseSchema);

module.exports = MyCourse;
