import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import { BookingStatus, IResourceBooking } from "../models/ResourceBooking";
import { IResource, ResourceType } from "../models/Resource";
import { EventStatus } from "../enums/eventStatus";
import { IEvent } from "../models/Event";



export class EventService {
    public static async createEvent(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("event/events");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getEvents(status: EventStatus): Promise<AppResponse<IEvent[]>> {
        const url = Util.apiUrl(`event/events/${status}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateEvent(eventId: string, status: EventStatus): Promise<AppResponse<IEvent>> {
        const url = Util.apiUrl(`event/update-event/${eventId}`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, { status});
    }
}  