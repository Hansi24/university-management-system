import { model, Schema } from "mongoose";
import { IAssignmentSubmission, SubmissionStatus } from "../modal/IAssignmentSubmission";

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
    {
      assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "ModuleMaterial",
        required: true,
      }, // Reference to the Assignment
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }, // Reference to the Student
      fileUrl: { type: String, required: true }, // URL or path to the submitted file
      submissionDate: { type: Date, default: Date.now }, // Date of submission
      status: {
        type: String,
        enum: Object.values(SubmissionStatus),
        default: SubmissionStatus.PENDING,
      }, // Status of the submission
      grade: { type: Number }, // Grade given by the lecturer
      feedback: { type: String }, // Feedback from the lecturer
    },
    {
      timestamps: true,
    }
  );
  
  export const AssignmentSubmission = model<IAssignmentSubmission>(
    "AssignmentSubmission",
    assignmentSubmissionSchema
  );