import { Document, Types } from "mongoose";
import { AdminType, Gender, LecturerType, Role, StudentType } from "../enums/UserEnums";

export interface IUser {
    _id?: string;
    name: string;
    role: Role;
    type: StudentType | LecturerType | AdminType;
    batch?: number; // Only for students
    courseId?: string; // For students & lecturers
    semester?: string[]; // Only for students
    enrolledModules?: EnrolledModule[]; // Only for students
    teachingModules?: Types.ObjectId[]; // Only for lecturers
    regId: string;
    gender: Gender;
    address: {
      street: string;
      city: string;
      zip: string;
      country: string;
    };
    email: string;
    phone: string;
    password: string;
    profilePic?: string;
}
interface EnrolledModule {
  moduleId: Types.ObjectId;
  status: EnrolledModuleStatus;
}

export enum EnrolledModuleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
 
export interface ILoginUser {
    regId: string;
    password: string;
}