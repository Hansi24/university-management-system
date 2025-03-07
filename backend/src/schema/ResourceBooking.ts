import { Schema, model } from "mongoose";
import { IResourceBooking } from "../modal/IResourceBooking";
import { BookingStatus } from "../enums/BookingStatus";

const resourceBookingSchema = new Schema<IResourceBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING }
});

export default model<IResourceBooking>("ResourceBooking", resourceBookingSchema);
