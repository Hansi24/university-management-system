import { ObjectId } from "mongoose";

export interface IDaySchedule {
  timeSlot: string;   // Example: "8:00 - 9:00"
  moduleId: ObjectId;
  lecturerId: ObjectId;
  location: ObjectId;
}

export interface ISchedule {
  _id?: string;
  courseId: ObjectId;
  semester: number;
  days: {
    [key: string]: IDaySchedule[]; // Example: { Monday: [ {..}, {..} ] }
  };
}
