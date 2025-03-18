import { ICourse, ISemester } from '../modal/ICourse';
import Course from '../schema/Course';
import { ObjectId, Types } from 'mongoose';
import { User } from '../schema/User';
import Schedule from '../schema/Schedule';
import { ISchedule } from '../modal/ISchedule';
import Resource from '../schema/Resource';


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

export const enrollStudentDao = async (courseId: string, moduleId: string, studentId: Types.ObjectId) => {
  try {
    // Convert moduleId to ObjectId
    const objectIdModuleId = new Types.ObjectId(moduleId);

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if the module exists in the course
    const moduleExists = course.semesters.some((semester) =>
      semester.modules.some((module) => module && module._id && new Types.ObjectId(module._id).equals(objectIdModuleId))
    );
    if (!moduleExists) {
      throw new Error("Module not found in the course");
    }

    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if the student is already enrolled in the module
    const isAlreadyEnrolled = student.enrolledModules?.some((module) =>
      module.moduleId.equals(objectIdModuleId)
    );
    if (isAlreadyEnrolled) {
      throw new Error("Student already enrolled in this module");
    }

    // Add the module to the student's enrolledModules array
    student.enrolledModules?.push({
      moduleId: objectIdModuleId
    });

    // Save the updated student
    await student.save();

    // Return success message or updated student
    return student;
  } catch (error) {
    throw error;
  }
};

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


export const createTimetableDao = async (timetableData: ISchedule) => {
  try {
    // Check if the course exists
    const course = await Course.findById(timetableData.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Extract all resource IDs from the timetable data
    const resourceIds: ObjectId[] = [];
    for (const day of Object.values(timetableData.days)) {
      for (const slot of day) {
        if (slot.location) {
          resourceIds.push(slot.location);
        }
      }
    }

    // Find all resources and update their availability to false
    await Resource.updateMany(
      { _id: { $in: resourceIds } }, // Find resources with IDs in the list
      { $set: { availability: false } } // Update their availability
    );

    // Save the timetable
    const timetable = new Schedule(timetableData);
    return await timetable.save();
  } catch (error) {
    throw error;
  }
};
export const getTimetableDao = async (courseId:string, semester:number) => {
  try {
    // Check if the course exists
    const course = await Course.findById({_id:new Types.ObjectId(courseId)});
    if (!course) {
      throw new Error("Course not found");
    }
    const timeTable = await Schedule.findOne({courseId:new Types.ObjectId(courseId), semester:semester});
    if (!timeTable) {
      throw new Error("Timetable not found");
    }
    return timeTable;
  } catch (error) {
    throw error;
  }
};

export const updateTimetableDao = async (courseId: string, semester: number, timetableData: ISchedule) => {
  try {
    // Find the existing timetable
    const existingTimetable = await Schedule.findOne({ courseId: new Types.ObjectId(courseId), semester: semester });
    if (!existingTimetable) {
      throw new Error("Timetable not found");
    }

    console.log("Existing Timetable:", existingTimetable);
    console.log("Existing Timetable Days:", existingTimetable.days);

    // Validate and extract previously assigned resource IDs
    const previousResourceIds: ObjectId[] = [];
    if (existingTimetable.days && typeof existingTimetable.days === 'object') {
      for (const day of Object.values(existingTimetable.days)) {
        if (Array.isArray(day)) {
          for (const slot of day) {
            if (slot.location) {
              previousResourceIds.push(slot.location);
            }
          }
        } else {
          console.warn("Unexpected structure for day:", day);
        }
      }
    } else {
      console.warn("Existing timetable days is not an object:", existingTimetable.days);
    }

    // Free up previously used resources
    await Resource.updateMany(
      { _id: { $in: previousResourceIds } },
      { $set: { availability: true } }
    );

    // Validate and extract new resource IDs from the updated timetable data
    const newResourceIds: ObjectId[] = [];
    if (timetableData.days && typeof timetableData.days === 'object') {
      for (const day of Object.values(timetableData.days)) {
        if (Array.isArray(day)) {
          for (const slot of day) {
            if (slot.location) {
              newResourceIds.push(slot.location);
            }
          }
        } else {
          console.warn("Unexpected structure for day:", day);
        }
      }
    } else {
      console.warn("Timetable data days is not an object:", timetableData.days);
    }

    // Mark new resources as unavailable
    await Resource.updateMany(
      { _id: { $in: newResourceIds } },
      { $set: { availability: false } }
    );

    // Update the timetable in the database
    const updatedTimetable = await Schedule.findOneAndUpdate(
      { courseId, semester },
      { $set: timetableData },
      { new: true } // Return the updated document
    );

    return updatedTimetable;
  } catch (error) {
    console.error("Error in updateTimetableDao:", error);
    throw error;
  }
};
 
export const getModulesDao = async (courseId: string, semester: number) => {
  try {
    // Validate courseId
    if (!Types.ObjectId.isValid(courseId)) {
      throw new Error("Invalid courseId");
    }

    // Find the course by ID
    const course: ICourse | null = await Course.findById(courseId).exec();

    if (!course) {
      throw new Error("Course not found");
    }

    // Find the semester by semester number
    const semesterData: ISemester | undefined = course.semesters.find(
      (sem) => sem.semesterNumber === semester
    );

    if (!semesterData) {
      throw new Error(`Semester ${semester} not found in course`);
    }

    // Return the modules for the semester
    return semesterData.modules;
  } catch (error) {
    console.error("Error in getModulesDao:", error);
    throw error; // Re-throw the error for handling in the service layer
  }
};

export const getSemestersAndModulesDao = async (courseId:string, studentId: string) =>{
  try {
      const course = new Types.ObjectId(courseId);
      const student = new Types.ObjectId(studentId)
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
        throw new Error("Course not found" );
      }
      const existingStudent= await User.findById(student);
      if (!existingStudent) {
        throw new Error("Student not found" );
      }
      const semesters = [];
      const studentSemester = Number(existingStudent.semester);
      if (isNaN(studentSemester)) {
        throw new Error("Invalid semester value for student");
      }
      for (let i = 1; i <= studentSemester; i++) {
        const semester = existingCourse.semesters.find((sem) => sem.semesterNumber === i);
        if (semester) {
          semesters.push({
            name: `Semester ${i}`,
            modules: semester.modules,
          });
        }
      }
      return semesters;
  } catch (error) {
      throw error;
  }
}