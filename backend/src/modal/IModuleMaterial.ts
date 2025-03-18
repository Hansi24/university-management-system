import { Types } from "mongoose";

export enum ModuleMaterialType {
    LECTURE = "LECTURE",
    ASSIGNMENT = "ASSIGNMENT",
    QUIZ = "QUIZ",
    RESOURCE = "RESOURCE",
  }
  
  export interface IModuleMaterial {
    _id?: Types.ObjectId;
    title: string;
    description?: string;
    type: ModuleMaterialType;
    moduleId: Types.ObjectId;
    fileUrl?: string; 
    dueDate?: Date; 
    createdAt: Date;
    updatedAt: Date;
  }