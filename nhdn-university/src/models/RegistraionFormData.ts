import { AdminType, Gender, LecturerType, ROLE_TYPES, StudentType, USER_TYPES } from "../enums/roleEnums";
import { ICourse, IModule } from "./Course";

export interface IAddress {
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface IRegisterFormData {
  name: string;
  email: string;
  phone: string;
  role: ROLE_TYPES;
  type: StudentType | LecturerType | AdminType;
  batch?: number; // Only for students
  courseId?: string; // For students & lecturers
  teachingModules?: string[]; // Only for lecturers
  gender: Gender;
  address: IAddress;
  profilePic?: File;
}
export interface IUsers {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: ROLE_TYPES;
  type: StudentType | LecturerType | AdminType;
  batch?: number; // Only for students
  courseId?: string | ICourse; // For students & lecturers
  teachingModules?: string[] | IModule[]; // Only for lecturers
  gender: Gender;
  address: IAddress;
  profilePic?: File | string;
  regId: string;
  semester: number;
}
