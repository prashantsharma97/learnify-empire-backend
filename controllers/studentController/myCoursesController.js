const Course = require("../../models/Instructor/course");
const Enrollment = require("../../models/Student/Enrollment");
const mongoose = require("mongoose");

// const getCourseWithInstructor = async (req, res) => {
//     try {
//         const courses = await Course.find()
//             .populate('instructorId', 'username profileImage')
//             .exec();

//         if (!courses || courses.length === 0) {
//             return res.status(404).json({ message: "No courses found." });
//         }
//         res.json({ message: "Course with instructor details found", courses });
//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// }

const getCourseWithInstructor = async (req, res) => {
    const { studentId } = req.params;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        console.log("Invalid studentId:", studentId);
        return res.status(400).json({ message: "Invalid studentId" });
    }

    try {
        // Fetch all courses with instructor details
        const courses = await Course.find()
            .populate('instructorId', 'username profileImage')
            .exec();

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found." });
        }

        // Fetch all the enrolled courses of the student
        const enrolledCourses = await Enrollment.find({ studentId })
            .select('courseId')
            .exec();

        // Create an array of enrolled course IDs for fast lookup
        const enrolledCourseIds = enrolledCourses.map(enrollment => enrollment.courseId.toString());

        // Add enrollment status to each course
        const coursesWithStatus = courses.map(course => {
            return {
                ...course.toObject(),
                isEnrolled: enrolledCourseIds.includes(course._id.toString())
            };
        });

        res.json({
            message: "Courses with instructor details found",
            courses: coursesWithStatus
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// const getCourseById = async (req, res) => {
//     const { id } = req.params;
//     const { studentId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid course ID" });
//     }

//     try {
//         const course = await Course.findById(id)
//             .populate('instructorId', 'username profileImage')
//             .exec();

//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         const enrolledCourses = await Enrollment.find({ studentId })
//             .select('courseId')
//             .exec();

//         // Create an array of enrolled course IDs for fast lookup
//         const enrolledCourseIds = enrolledCourses.map(enrollment => enrollment.courseId.toString());

//         // Add enrollment status to each course
//         const coursesWithStatus = course.map(course => {
//             return {
//                 ...course.toObject(),
//                 isEnrolled: enrolledCourseIds.includes(course._id.toString())
//             };
//         });

//         res.json({ message: "Course found", course: coursesWithStatus });
//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// }

const getCourseById = async (req, res) => {
    const { id, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid course ID" });
    }

    try {
        const course = await Course.findById(id)
            .populate('instructorId', 'username profileImage')
            .exec();

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const enrolledCourses = await Enrollment.find({ studentId })
            .select('courseId')
            .exec();

        const enrolledCourseIds = enrolledCourses.map(e =>
            e.courseId.toString()
        );

        // ✅ Single object handle karo
        const courseWithStatus = {
            ...course.toObject(),
            isEnrolled: enrolledCourseIds.includes(course._id.toString())
        };

        res.json({ message: "Course found", course: courseWithStatus });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const enrollCourses = async (req, res) => {
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

// const getEnrolledCourses = async (req, res) => {
//     const { studentId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(studentId)) {
//         return res.status(400).json({ message: "Invalid studentId" });
//     }
//     try {
//         const enrollments = await Enrollment.find({ studentId })
//             .populate('courseId', 'title description instructorId')
//             .exec();
//         const instructorName = await Course.populate(enrollments, { path: 'courseId.instructorId', select: 'username' });


//         res.status(200).json({
//             message: "Enrolled courses found",
//             // enrollments,
//             instructorName
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Server error",
//             error: err.message
//         });
//     }
// }

const getEnrolledCourses = async (req, res) => {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ message: "Invalid studentId" });
    }

    try {
        // Fetch enrollments, and populate course details including instructor name
        const enrollments = await Enrollment.find({ studentId })
            .populate({
                path: 'courseId',
                select: ' _id title description instructorId thumbnail', // Get title, description, and instructorId
                populate: {
                    path: 'instructorId', // Nested populate to get instructor details
                    select: 'username' // Only select username of the instructor
                }
            })
            .exec();

        // Map through enrollments to create a clean response
        const coursesWithInstructor = enrollments.map(enrollment => ({
            id: enrollment.courseId._id,
            title: enrollment.courseId.title,
            description: enrollment.courseId.description,
            instructor: enrollment.courseId.instructorId?.username || 'Instructor not found',
            thumbnail: enrollment.courseId.thumbnail || null
        }));
        console.log(coursesWithInstructor);

        res.status(200).json({
            message: "Enrolled courses found",
            courses: coursesWithInstructor // Returning clean data
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = { getCourseWithInstructor, getCourseById, enrollCourses, getEnrolledCourses };