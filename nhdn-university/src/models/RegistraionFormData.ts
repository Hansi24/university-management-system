import { AdminType, Gender, LecturerType, ROLE_TYPES, StudentType } from "../enums/roleEnums";

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