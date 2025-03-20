// interfaces.ts

import { EventStatus } from "../enums/eventStatus";

export interface IEvent {
  _id?: string;
  title: string;
  description?: string;
  organizerId: IEventUser; // Reference to IUser
  date: string;
  status: EventStatus;
  location: string;
  flyer: string;
}

export interface IEventUser {
  _id: string;
  name: string;
  email: string;
  regId: string;
}

export interface IEventRequest {
    title: string;
    description: string;
    date: string; // Date in YYYY-MM-DD format
    time: string; // Time in HH:MM format
    location: string;
    flyer: string;
}

export { EventStatus };
