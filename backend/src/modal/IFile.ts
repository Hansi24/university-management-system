import { ObjectId } from "mongoose";
import { FileType } from "../enums/FileType";

export interface IFile {
    _id?: string;
    userId: ObjectId;
    fileType: FileType;
    url: string; 
    uploadedAt?: Date;
  }
  