import { Schema, model } from "mongoose";
import { IEvent } from "../modal/IEvent";

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
});

export default model<IEvent>("Event", eventSchema);
