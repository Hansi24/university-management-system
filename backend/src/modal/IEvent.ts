import { ObjectId, Types } from "mongoose";
import { EventStatus } from "../enums/BookingStatus";

export interface IEvent {
    _id?: string;
    title: string;
    description?: string;
    organizerId: Types.ObjectId; // Reference to IUser
    date: Date;
    status: EventStatus;
    location: string;
    flyer: string;
}
  