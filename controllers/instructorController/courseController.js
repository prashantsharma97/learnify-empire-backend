const Course = require("../../models/Course");

const createCourse = async (req, res) => {
    const { title, description, category, difficultyLevel, thumbnail, lessons, pricingInfo } = req.body;
    try {
        const newCourse = new Course({
            title,
            description,
            category,
            difficultyLevel,
            thumbnail,
            lessons, 
            pricingInfo
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course found", course });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, difficultyLevel, thumbnail, lessons, pricingInfo } = req.body;

        const course = await Course.findByIdAndUpdate(
            id,
            { title, description, category, difficultyLevel, thumbnail, lessons, pricingInfo },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course updated successfully", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        // const course = await Course.findByIdAndDelete(id);
        const course = await Course.deleteMany({ _id: id });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted successfully", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };