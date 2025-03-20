import { EventParticipationStatus } from "../enums/eventStatus";

export interface IEventAttendee {
    _id?: string;
    eventId: string; // Reference to IEvent
    userId: string; // Reference to IUser
    status: EventParticipationStatus;
}
  