const express = require("express");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/instructorController/courseController");
const uploadFile = require("multer-upload-helper");
const { protect, authorize } = require("../utils/authUtils");


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

module.exports = router;