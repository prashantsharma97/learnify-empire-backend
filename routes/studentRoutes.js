const express = require("express");
const { getEnrolledCourses, getCourseWithInstructor } = require("../controllers/studentController/myCoursesController");
const { protect, authorize } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");

const router = express.Router();

router.get("/my-courses", protect, authorize(ROLES.STUDENT),getCourseWithInstructor );
router.post("/enroll-course", protect, authorize(ROLES.STUDENT), getEnrolledCourses );

module.exports = router;