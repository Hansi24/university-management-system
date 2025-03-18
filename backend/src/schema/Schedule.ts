import mongoose, { Schema } from "mongoose";
import { IDaySchedule, ISchedule } from "../modal/ISchedule";

const DayScheduleSchema = new Schema<IDaySchedule>({
  timeSlot: { type: String, required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
  lecturerId: { type: Schema.Types.ObjectId, ref: "Lecturer", required: true },
  location: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
});

const ScheduleSchema = new Schema<ISchedule>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number, required: true },
  days: {
    type: Map,
    of: [DayScheduleSchema], 
    default: {},
  },
});

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);