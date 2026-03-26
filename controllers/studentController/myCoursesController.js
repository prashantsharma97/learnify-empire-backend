const Course = require("../../models/Instructor/course");
const Enrollment = require("../../models/Student/Enrollment");
const mongoose = require("mongoose");

const getCourseWithInstructor = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructorId', 'username profileImage')
            .exec();

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found." });
        }
        res.json({ message: "Course with instructor details found", courses });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getEnrolledCourses = async (req, res) => {
    const { studentId, courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid studentId or courseId" });
    }

    try {
        const existing = await Enrollment.findOne({ studentId, courseId });
        if (existing) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        const enroll = new Enrollment({
            studentId,
            courseId
        });

        await enroll.save();
        res.status(201).json({
            message: "Enrolled successfully",
            enrollment: enroll
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}


module.exports = { getCourseWithInstructor, getEnrolledCourses };