import { ObjectId } from "mongoose";

export interface IEvent {
    _id?: string;
    title: string;
    description?: string;
    organizerId: ObjectId; // Reference to IUser
    date: Date;
    location: string;
}
  