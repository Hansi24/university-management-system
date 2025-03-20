import { sendEventRequestEmail } from "../email/requestEvent";
import { EventStatus } from "../enums/BookingStatus";
import { EventParticipationStatus } from "../enums/EventStatus";
import { AdminType } from "../enums/UserEnums";
import { IEvent } from "../modal/IEvent";
import Event from "../schema/Event";
import EventAttendee from "../schema/EventAttendee";
import { User } from "../schema/User";
import { ObjectId, Types } from 'mongoose';

export const createEventDao = async (event: IEvent): Promise<IEvent> => {
  try {
    const eventAdmin = await User.findOne({ type: AdminType.EVENT });
    if (!eventAdmin) {
      throw new Error("Event admin not found");
    }
    const existingUser = await User.findById(event.organizerId);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const newEvent = new Event(event);
    await newEvent.save();
    await sendEventRequestEmail(
      eventAdmin.email,
      event.title, 
      event.description || "No description provided", 
      event.date, 
      event.location, 
      existingUser
    );

    return newEvent;
  } catch (error) {
    throw error;
  }
};

export const getEventsDao = async (filter:EventStatus): Promise<IEvent[]> => {
    try {
        const events = await Event.find({status:filter}).populate("organizerId", "name email");
        return events;
    } catch (error) {
        throw error;
    }
};

export const getEventByIdDao = async (eventId: string): Promise<IEvent> => {
    try {
        const id = new Types.ObjectId(eventId);
        const event = await Event.findById(id).populate("organizerId", "name email");
        if (!event) {
            throw new Error('Event not found');
        }
        return event;
    } catch (error) {
        throw error;
    }
};
export const getEventByUserDao = async (userId: Types.ObjectId): Promise<IEvent[]> => {
    try {
        const events = await Event.find({organizerId:userId}).populate("organizerId", "name email");
        if (!events) {
            throw new Error('events not found');
        }
        return events;
    } catch (error) {
        throw error;
    }
};

export const updateEventDao = async (eventId: string, status: EventStatus) => {
    try {
        const id = new Types.ObjectId(eventId);
        const updatedEvent = await Event.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updatedEvent) {
            throw new Error('Event not found');
        }
        return updatedEvent;
    } catch (error) {
        throw error;
    }
};

export const updateParticipationStatusDao = async (eventId: string, status:EventParticipationStatus, userId: Types.ObjectId) => {
    try {
        // Find or create the attendee record
        let attendee = await EventAttendee.findOne({ eventId, userId });
    
        if (!attendee) {
          attendee = new EventAttendee({ eventId, userId, status });
        } else {
          attendee.status = status;
        }
        await attendee.save();
        return attendee;
      } catch (error) {
        throw error;
      }
};
