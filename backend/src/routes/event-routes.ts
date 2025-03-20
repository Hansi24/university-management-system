import express from "express";
import { createEvent, getEventById, getEventByUser, getEvents, updateEvent, updateParticipationStatus } from "../endpoint/event-ep";
import upload from "../middlewares/multer"

const router = express.Router();

// Event routes
router.post("/events", upload.single("flyer"), createEvent);
router.get("get-event-by-user", getEventByUser)
router.get("/events/:status", getEvents);
router.get("/:eventId", getEventById);
router.patch("/update-event/:id", updateEvent);
router.patch("/events/:eventId/attendees", updateParticipationStatus);

export default router;