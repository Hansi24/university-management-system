import express from "express";
import { createEvent, getAllUpcomingApprovedEvents, getEventById, getEventByUser, getEventParticipants, getEvents, updateEvent, updateParticipationStatus } from "../endpoint/event-ep";
import upload from "../middlewares/multer"
import { Util } from "../utils/util";

const router = express.Router();

// Event routes
router.post("/events", upload.single("flyer"), Util.withErrorHandling(createEvent));
router.get("/get-event-by-user", Util.withErrorHandling(getEventByUser));
router.get("/events/:status", Util.withErrorHandling(getEvents));
router.get("/:eventId", Util.withErrorHandling(getEventById));
router.patch("/update-event/:id", Util.withErrorHandling(updateEvent));
router.patch("/events/:eventId/attendees", Util.withErrorHandling(updateParticipationStatus));
router.get("/events/participants/:eventId", Util.withErrorHandling(getEventParticipants));
router.get('/get-all/approved/upcoming-events', Util.withErrorHandling(getAllUpcomingApprovedEvents));

export default router;