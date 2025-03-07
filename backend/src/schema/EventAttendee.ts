import { Schema, model } from "mongoose";
import { IEventAttendee } from "../modal/IEventAttendee";
import { EventStatus } from "../enums/EventStatus";

const eventAttendeeSchema = new Schema<IEventAttendee>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: Object.values(EventStatus), default: EventStatus.ATTENDING }
});

export default model<IEventAttendee>("EventAttendee", eventAttendeeSchema);
