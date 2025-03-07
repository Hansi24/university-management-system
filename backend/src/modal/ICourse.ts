import { ObjectId, Types } from "mongoose";

export interface IModule {
    name: string;
    code?: string;
    description?: string;
    semester: number;
}

export interface ISemester {
    semesterNumber: number;
    modules: IModule[];
}

export interface ICourse {
    _id?: string;
    name: string;
    code?: string;
    students?: Types.ObjectId[];
    semesters: ISemester[];
    createdAt?: Date;
    updatedAt?: Date;
}
