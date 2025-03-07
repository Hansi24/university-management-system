import { Schema, model } from "mongoose";
import { ICourse } from "../modal/ICourse";

const moduleSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

const semesterSchema = new Schema({
  semesterNumber: { type: Number, required: true },
  modules: [moduleSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    semesters: [semesterSchema],
  },
  {
    timestamps: true,
  }
);

export default model<ICourse>("Course", courseSchema);
