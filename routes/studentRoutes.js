const express = require("express");
const { enrollCourses, getEnrolledCourses, getCourseById, getCourseWithInstructor } = require("../controllers/studentController/myCoursesController");
const { protect, authorize } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");

const router = express.Router();

router.get("/browse-courses-list/:studentId", protect, authorize(ROLES.STUDENT),getCourseWithInstructor );
router.get("/browse-courses/:id/:studentId", protect, authorize(ROLES.STUDENT), getCourseById );
router.post("/enroll-course", protect, authorize(ROLES.STUDENT), enrollCourses );
router.get("/enrolled-courses/:studentId", protect, authorize(ROLES.STUDENT), getEnrolledCourses );

module.exports = router;