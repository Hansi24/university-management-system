import express from "express";
import { createCourse, createTimetable, deleteCourse, enrollStudent, getAllCourses, getCourseById, getModules, getSemestersAndModules, getTimetable, unEnrollStudent, updateCourse, updateTimetable } from "../endpoint/course-ep";
import { Util } from "../utils/util";

const router = express.Router();

router.post("/", Util.withErrorHandling(createCourse)); // Create Course
router.get("/", Util.withErrorHandling(getAllCourses)); // Get All Courses
router.get("/:id", Util.withErrorHandling(getCourseById)); // Get Single Course
router.patch("/:id", Util.withErrorHandling(updateCourse)); // Update Course
router.delete("/:id", Util.withErrorHandling(deleteCourse)); // Delete Course
router.post("/:courseId/enroll", Util.withErrorHandling(enrollStudent)); // Enroll in Course
router.post("/:courseId/unenroll", Util.withErrorHandling(unEnrollStudent)); // Unenroll from Course
router.post("/create-timetable", Util.withErrorHandling(createTimetable)); // Create
router.get("/get-timetable/:courseId/:semester", Util.withErrorHandling(getTimetable)); // Get)
router.patch("/update-timetable/:courseId/:semester", Util.withErrorHandling(updateTimetable));
router.get("/get-modules/:courseId/:semester", Util.withErrorHandling(getModules));
router.get("/:courseId/semesters", Util.withErrorHandling(getSemestersAndModules));

export default router;
