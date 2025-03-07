import { NextFunction, Request, Response } from 'express';
import { Util } from '../utils/util';
import { createCourseDao, deleteCourseDao, enrollStudentDao, getAllCoursesDao, getCourseByIdDao, unEnrollStudentDao, updateCourseDao } from '../dao/course-dao';
import exp from 'constants';

// Create new user
export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, code, semesters } = req.body;
    try {
        const adminId = req.user.userId;
        if (req.user.userRole !== "admin") {
            return Util.sendError(res, "You are not authorized to create course", 401);
        }
        const courseDetails = await createCourseDao({ name, code, semesters }, adminId);
        return Util.sendSuccess(res, courseDetails, "course created successfully");
    } catch (error) {
        next(error);
    }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await getAllCoursesDao();
        return Util.sendSuccess(res, courses, "courses fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const course = await getCourseByIdDao(req.params.id);
        return Util.sendSuccess(res, course, "course fetched successfully");
    } catch (error) {
        next(error);
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.user.userRole !== "lecturer" && req.user.userRole !== "admin") {
            return Util.sendError(res, "You are not authorized to update course", 401);
        }
        const updatedCourse = await updateCourseDao(req.params.id, req.body);
        return Util.sendSuccess(res, updatedCourse, "course updated successfully");
    } catch (error) {
        next(error);
    }
}

export const deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.user.userRole !== "lecturer" && req.user.userRole !== "admin") {
            return Util.sendError(res, "You are not authorized to delete course", 401);
        }
        const deletedCourse = await deleteCourseDao(req.params.id);
        return Util.sendSuccess(res, deletedCourse, "course deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const enrollStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const moduleId = req.params.moduleId;
        const studentId = req.user.userId;
        const course = await enrollStudentDao(moduleId, studentId);
        return Util.sendSuccess(res, course, "You have been enrolled in the module");
    } catch (error) {
        next(error);
    }
};

export const unEnrollStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user.userId;
        const course = await unEnrollStudentDao(courseId, studentId);
        return Util.sendSuccess(res, course, "You have been unenrolled from the course");
    } catch (error) {
        next(error);
    }
};
    