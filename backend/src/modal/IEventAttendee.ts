import { ObjectId } from "mongoose";
import { EventParticipationStatus } from "../enums/EventStatus";

export interface IEventAttendee {
    _id?: string;
    eventId: ObjectId; // Reference to IEvent
    userId: ObjectId; // Reference to IUser
    status: EventParticipationStatus;
}
  