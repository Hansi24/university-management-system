import { Types } from "mongoose";

export enum SubmissionStatus {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    GRADED = "GRADED",
  }
  
  export interface IAssignmentSubmission {
    assignmentId: Types.ObjectId; // Reference to the Assignment (ModuleMaterial)
    studentId: Types.ObjectId; // Reference to the Student (User)
    fileUrl: string; // URL or path to the submitted file
    submissionDate: Date; // Date of submission
    status: SubmissionStatus; // Status of the submission
    grade?: number; // Grade given by the lecturer
    feedback?: string; // Feedback from the lecturer
    createdAt: Date;
    updatedAt: Date;
  }