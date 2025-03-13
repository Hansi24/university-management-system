import { ICourse } from '../modal/ICourse';
import Course from '../schema/Course';
import { Types } from 'mongoose';
import { User } from '../schema/User';
import { EnrolledModuleStatus } from '../modal/IUser';


export const createCourseDao = async (courseData: ICourse) => {
  try {
      const existingCourse = await Course.findOne({ name: courseData.name });

      if (existingCourse) {
          throw new Error('Course already exists');
      }
      const newCourse = new Course({
        name: courseData.name,
        code: courseData.code,
        semesters: courseData.semesters
      });
      await newCourse.save();
      return {newCourse: newCourse};
  } catch (error) {
      throw error;
  }
};

export const getAllCoursesDao = async () => {
  try {
      const courses = await Course.find();
      return courses;
  } catch (error) {
      throw error;
  }
};

export const getCourseByIdDao = async (courseId: string) => {
  try {
      const course = await Course.findById(courseId);
      return course;
  } catch (error) {
      throw error;
  }
};

export const updateCourseDao = async (courseId: string, courseData: ICourse) => {
  try {
      const course = await Course.findByIdAndUpdate(new Types.ObjectId(courseId), courseData, { new: true });
      if (!course) {
          throw new Error('Course not found');
      }
      return course;
  } catch (error) {
      throw error;
  }
};

export const deleteCourseDao = async (courseId: string) => {
  try {
      const course = await Course.findByIdAndDelete(new Types.ObjectId(courseId));
      if (!course) {
          throw new Error('Course not found');
      }
      return course;
  } catch (error) {
      throw error;
  }
};

export const enrollStudentDao = async (courseId:string, moduleId: string, studentId: Types.ObjectId) => {
  try {
      const course = await Course.findById(courseId);
      if (!course?.semesters.find(s => s.modules.find(m => m._id === moduleId))) {
          throw new Error('Module not found');
      }
      const student = await User.findById(studentId);
      if (!student) {
          throw new Error('Student not found');
      }
      const objectIdModuleId = new Types.ObjectId(moduleId);
      const enrolledModule = student.enrolledModules?.find(m => m.moduleId.equals(objectIdModuleId));
      if (enrolledModule) {
          throw new Error('Student already enrolled in this module');
      }
      student.enrolledModules?.push({ moduleId: objectIdModuleId, status: EnrolledModuleStatus.PENDING });
      await student.save();
      return module;
  } catch (error) {
      throw error;
  }
}

export const unEnrollStudentDao = async (courseId:string, moduleId: string, studentId: Types.ObjectId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course?.semesters.find(s => s.modules.find(m => m._id === moduleId))) {
        throw new Error('Module not found');
    }
      const student = await User.findById(studentId);
      if (!student) {
          throw new Error('Student not found');
      }
      const objectIdModuleId = new Types.ObjectId(moduleId);
      const enrolledModule = student.enrolledModules?.find(m => m.moduleId.equals(objectIdModuleId));
      if (!enrolledModule) {
          throw new Error('Student not enrolled in the course');
      }
      student.enrolledModules = student.enrolledModules?.filter((module) => module.moduleId !== objectIdModuleId);
      await course.save();
      return course;
  } catch (error) {
      throw error;
  }
};