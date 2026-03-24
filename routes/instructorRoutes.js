const express = require("express");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/instructorController/courseController");
const uploadFile = require("multer-upload-helper");
const { protect, authorize } = require("../utils/authUtils");
// const multer = require("multer");
// const path = require("path");
// const upload = require("../utils/multerConfig");

const router = express.Router();

const upload = uploadFile({
    destination: "uploads/",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: /jpeg|jpg|png|pdf/
});



router.post("/upload-course", upload.single("thumbnail"), createCourse);
router.get("/get-courses", getCourses);
router.get("/get-course/:id", getCourseById);
router.put("/update-course/:id", updateCourse);
router.delete("/delete-course/:id", deleteCourse);
// user details route
// router.get("/instructor-details", protect, authorize("instructor"), instructorDetails);
// router.put("/update-instructor-details", protect, authorize("instructor"), upload.single("profileImage"), updateInstructorDetails);
// router.put("/change-password", protect, authorize("instructor"), changePassword);

module.exports = router;