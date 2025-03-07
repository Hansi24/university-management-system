import express from "express";
import { createCourse, deleteCourse, enrollStudent, getAllCourses, getCourseById, unEnrollStudent, updateCourse } from "../endpoint/course-ep";

const router = express.Router();

router.post("/", createCourse); // Create Course
router.get("/", getAllCourses); // Get All Courses
router.get("/:id", getCourseById); // Get Single Course
router.patch("/:id", updateCourse); // Update Course
router.delete("/:id", deleteCourse); // Delete Course
router.post("/:courseId/enroll", enrollStudent); // Enroll in Course
router.post("/:courseId/unenroll", unEnrollStudent); // Unenroll from Course

export default router;
