import { ObjectId } from "mongoose";
import { BookingStatus } from "../enums/BookingStatus";

export interface IResourceBooking {
    _id?: string;
    userId: ObjectId; // Reference to IUser
    resourceId: ObjectId; // Reference to IResource
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
}
  