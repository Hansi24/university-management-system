import { ObjectId } from "mongoose";

export interface ISchedule {
    _id?: string;
    courseId: ObjectId; // Reference to ICourse
    lecturerId: ObjectId; // Reference to IUser
    startTime: Date;
    endTime: Date;
    location: string;
  }
  