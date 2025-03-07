import { ICourse } from '../modal/ICourse';
import Course from '../schema/Course';
import { Types } from 'mongoose';
import { User } from '../schema/User';


export const createCourseDao = async (courseData: ICourse, adminId:Types.ObjectId) => {
  try {
      const existingCourse = await User.findOne({ name: courseData.name });

      if (existingCourse) {
          throw new Error('Course already exists');
      }
      const newCourse = new Course({
        courseData
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

export const enrollStudentDao = async (moduleId: string, studentId: Types.ObjectId) => {
  try {
      const module = await Course.findOne({ 'semesters.modules._id': moduleId });
      if (!module) {
          throw new Error('module not found');
      }
      const student = await User.findById(studentId);
      if (!student) {
          throw new Error('Student not found');
      }
      module.students?.push(studentId);
      await module.save();
      return module;
  } catch (error) {
      throw error;
  }
}

export const unEnrollStudentDao = async (courseId: string, studentId: Types.ObjectId) => {
  try {
      const course = await Course.findById(new Types.ObjectId(courseId));
      if (!course) {
          throw new Error('Course not found');
      }
      const student = await User.findById(studentId);
      if (!student) {
          throw new Error('Student not found');
      }
      if (!course.students?.includes(studentId)) {
          throw new Error('Student not enrolled in the course');
      }
      course.students = course.students?.filter((id) => id !== studentId);
      await course.save();
      return course;
  } catch (error) {
      throw error;
  }
};