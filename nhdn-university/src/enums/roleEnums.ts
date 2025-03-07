export enum ROLE_TYPES {
  STUDENT = "student",
  LECTURER = "lecturer",
  ADMIN = "admin",
}

export enum StudentType {
  STUDENT = "student",
  REP = "rep",
}

export enum LecturerType {
  LECTURER = "lecturer",
  HOD = "hod",
  TRAINEE = "trainee",
}

export enum AdminType {
  ACADEMIC = "academic",
  RESOURCE = "resource",
  EVENT = "event",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export type USER_TYPES = StudentType | LecturerType | AdminType;