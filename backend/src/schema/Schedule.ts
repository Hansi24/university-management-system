import { Schema, model } from "mongoose";
import { ISchedule } from "../modal/ISchedule";

const scheduleSchema = new Schema<ISchedule>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  lecturerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true }
});

export default model<ISchedule>("Schedule", scheduleSchema);
