import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: string;
    senderId: ObjectId; // Reference to IUser
    receiverId: ObjectId; // Reference to IUser
    content: string;
    createdAt?: Date;
  }
  