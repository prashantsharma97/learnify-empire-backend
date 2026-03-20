const Course = require("../../models/Course");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

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

const instructorDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "instructor not found" });
        res.json({ message: "instructor details retrieved successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateInstructorDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "instructor not found" });
        const { username, email, bio } = req.body;
        let profileImage = user.profileImage;
        if (req.file) {
            profileImage = req.file ? req.file.path.replace(/\\/g, "/") : null;
        }
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profileImage = profileImage;
        console.log("Updated profileImage:", user.profileImage); 
        await user.save();

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const userObj = user.toObject({ getters: true, virtuals: false });

        if (userObj.profileImage) {
            userObj.profileImage = `${baseUrl}/${userObj.profileImage}`;
        }

        res.json({ message: "instructor details updated successfully", user: userObj });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { currentPassword, newPassword } = req.body;
        console.log("passwords:", currentPassword, newPassword);
        const isMatch = await user.comparePassword(currentPassword);
        console.log("isMatch:", isMatch);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, instructorDetails, updateInstructorDetails, changePassword };