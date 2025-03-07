import { Document } from "mongoose";
import { AdminType, Gender, LecturerType, Role, StudentType } from "../enums/UserEnums";

export interface IUser {
    _id?: string;
    name: string;
    role: Role;
    type: StudentType | LecturerType | AdminType;
    batch?: number; // Only for students
    courseId?: string; // For students & lecturers
    semester?: string[]; // Only for students
    enrolledModules?: string[]; // Only for students
    teachingModules?: string[]; // Only for lecturers
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

 
export interface ILoginUser {
    regId: string;
    password: string;
}