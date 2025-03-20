import { NextFunction, Request, Response } from "express";
import { Util } from "../utils/util";
import { EventStatus } from "../enums/BookingStatus";
import { IEvent } from "../modal/IEvent";
import { createEventDao, getAllUpcomingApprovedEventsDao, getEventByIdDao, getEventByUserDao, getEventParticipantsDao, getEventsDao, updateEventDao, updateParticipationStatusDao } from "../dao/event-dao";
import { EventParticipationStatus } from "../enums/EventStatus";

export const createEvent = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const organizerId = req.user.userId;
    const { title, description, date, location } = req.body;
    const eventDate = new Date(date);
    let flyer = "";
    if (req.file) {
        flyer = (req.file as any).path;
    }
    const event: IEvent = {
      title,
      description,
      organizerId,
      date: eventDate,
      status: EventStatus.PENDING,
      location,
      flyer: flyer || "", 
    };
    const responseEvent = await createEventDao(event);
    return Util.sendSuccess(res, responseEvent, "Event Requested successfully");
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const status = req.params.status as EventStatus;
    const events = await getEventsDao(status);
    return Util.sendSuccess(res, events, "Events fetched successfully");
  } catch (error) {
    next(error);
  }
};
export const getAllUpcomingApprovedEvents = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const events = await getAllUpcomingApprovedEventsDao();
    return Util.sendSuccess(res, events, "Events fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request,res: Response,next: NextFunction) => {
    const eventId = req.params.eventId;
    try {
        const event = await getEventByIdDao(eventId);
        return Util.sendSuccess(res, event, "Event fetched successfully");
    } catch (error) {
        next(error);
    }
}
export const getEventByUser = async (req: Request,res: Response,next: NextFunction) => {
    const userId = req.user.userId;
    try {
        const events = await getEventByUserDao(userId);
        return Util.sendSuccess(res, events, "Event fetched successfully");
    } catch (error) {
        next(error);
    }
}
export const getEventParticipants = async (req: Request,res: Response,next: NextFunction) => {
    const eventId = req.params.eventId;
    try {
        const events = await getEventParticipantsDao(eventId);
        console.log(events);
        return Util.sendSuccess(res, events, "Event fetched successfully");
    } catch (error) {
        next(error);
    }
}

// Update an event (e.g., approve/reject)
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const event = await updateEventDao(id, status)
  
      if (!event) {
        return Util.sendError(res, "Event not found", 500);
      }
  
      return Util.sendSuccess(res, event, "Event fetched successfully");
    } catch (error) {
        next(error);
    }
};

export const updateParticipationStatus = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.user.userId;
        const { eventId } = req.params;
        const { status } = req.body;
        // Validate status
        if (!Object.values(EventParticipationStatus).includes(status)) {
            return Util.sendError(res, "Invalid participation status", 400);
        }
        const updatedParticipation = await updateParticipationStatusDao(eventId, status, userId);
        return Util.sendSuccess(res, updatedParticipation, "Participation status updated successfully");
    } catch (error) {
        next(error);
    }
}

