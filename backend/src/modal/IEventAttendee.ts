import { ObjectId } from "mongoose";
import { EventStatus } from "../enums/EventStatus";

export interface IEventAttendee {
    _id?: string;
    eventId: ObjectId; // Reference to IEvent
    userId: ObjectId; // Reference to IUser
    status: EventStatus;
}
  