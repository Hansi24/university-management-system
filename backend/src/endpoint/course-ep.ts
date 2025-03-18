import { NextFunction, Request, Response } from 'express';
import { Util } from '../utils/util';
import { createCourseDao, createTimetableDao, deleteCourseDao, enrollStudentDao, getAllCoursesDao, getCourseByIdDao, getModulesDao, getSemestersAndModulesDao, getTimetableDao, unEnrollStudentDao, updateCourseDao, updateTimetableDao } from '../dao/course-dao';
import exp from 'constants';
import { AdminType, Role } from '../enums/UserEnums';
import { ISchedule } from '../modal/ISchedule';

// Create new user
export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, code, semesters } = req.body;
    try {
        if (req.user.userRole !== Role.ADMIN && req.user.userRole !== AdminType.ACADEMIC) {
            return Util.sendError(res, "You are not authorized to create course", 401);
        }
        const courseDetails = await createCourseDao({ name, code, semesters });
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
        const courseId = req.params.courseId;
        const moduleId = req.body.moduleId;
        const studentId = req.user.userId;
        const course = await enrollStudentDao(courseId, moduleId, studentId);
        return Util.sendSuccess(res, course, "You have been enrolled in the module");
    } catch (error) {
        next(error);
    }
};

export const unEnrollStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseId = req.params.courseId;
        const moduleId = req.params.moduleId;
        const studentId = req.user.userId;
        const course = await unEnrollStudentDao(courseId, moduleId, studentId);
        return Util.sendSuccess(res, course, "You have been unenrolled from the course");
    } catch (error) {
        next(error);
    }
};

export const createTimetable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if(!(req.user.userRole === Role.ADMIN && req.user.userType === AdminType.ACADEMIC)) {
        return Util.sendError(res, "You are not authorized to create Timetable", 401);
      }
      const timetableData: ISchedule = req.body;
      const timetable = await createTimetableDao(timetableData);
      return Util.sendSuccess(res, timetable, "timetable created successfully");
    } catch (error) {
      res.status(500).json({ message: "Failed to create timetable", error });
    }
};
export const getTimetable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    const { courseId, semester } = req.params; 
    const timetable = await getTimetableDao(courseId, Number(semester));    
    return Util.sendSuccess(res, timetable, "timetable created successfully");
} catch (error) {
      res.status(500).json({ message: "Failed to create timetable", error });
    }
};

export const updateTimetable = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        if(!(req.user.userRole === Role.ADMIN && req.user.userType === AdminType.ACADEMIC)) {
        return Util.sendError(res, "You are not authorized to update Timetable", 401);
      }
      const timetableData: ISchedule = req.body;
      const { courseId, semester } = req.params; 
      const updatedTimetable = await updateTimetableDao(courseId, Number(semester),timetableData );
      return Util.sendSuccess(res, updatedTimetable, "timetable updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Failed to update timetable", error });
    }
};
export const getModules = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
      const { courseId, semester } = req.params; 
      const modules = await getModulesDao(courseId, Number(semester));
      return Util.sendSuccess(res, modules, "timetable updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Failed to update timetable", error });
    }
};
    
export const getSemestersAndModules = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const { courseId } = req.params;
    const { studentId } = req.query;
    try {
        const semesters = await getSemestersAndModulesDao(courseId, studentId as string);
        return Util.sendSuccess(res, semesters , "Representative updated successfully");
    } catch (error) {
        next(error);
    }
}