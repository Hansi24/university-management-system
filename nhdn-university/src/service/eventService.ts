import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import { BookingStatus, IResourceBooking } from "../models/ResourceBooking";
import { IResource, ResourceType } from "../models/Resource";
import { EventParticipationStatus, EventStatus } from "../enums/eventStatus";
import { IEvent } from "../models/Event";
import { IEventAttendee } from "../models/EventAttendee";



export class EventService {
    public static async createEvent(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("event/events");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getEvents(status: EventStatus): Promise<AppResponse<IEvent[]>> {
        const url = Util.apiUrl(`event/events/${status}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getEventsByUser(): Promise<AppResponse<IEvent[]>> {
        const url = Util.apiUrl(`event/get-event-by-user`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getEventById(eventId:string): Promise<AppResponse<IEvent>> {
        const url = Util.apiUrl(`event/${eventId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateEvent(eventId: string, status: EventStatus): Promise<AppResponse<IEvent>> {
        const url = Util.apiUrl(`event/update-event/${eventId}`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, { status});
    }
    public static async getEventParticipants(eventId: string): Promise<AppResponse<any[]>> {
        const url = Util.apiUrl(`event/events/participants/${eventId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getUpcomingApprovedEvents(): Promise<AppResponse<IEvent[]>> {
        const url = Util.apiUrl(`event/get-all/approved/upcoming-events`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateParticipation(eventId:string, status:EventParticipationStatus): Promise<AppResponse<IEventAttendee>> {
        const url = Util.apiUrl(`event/events/${eventId}/attendees`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, {status});
    }
}  