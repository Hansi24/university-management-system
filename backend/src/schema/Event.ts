import { Schema, model } from "mongoose";
import { IEvent } from "../modal/IEvent";
import { EventStatus } from "../enums/BookingStatus";

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: Object.values(EventStatus), default: EventStatus.PENDING },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date(); // Ensure the date is in the future
        },
        message: "Event date must be in the future."
      }
    },
    location: { type: String, required: true },
    flyer: { type: String },
  },
  { timestamps: true,
    toJSON: { virtuals: true }
  }
   // Adds `createdAt` and `updatedAt` fields
);

// Indexes
eventSchema.index({ organizerId: 1 });
eventSchema.index({ status: 1 });

// Virtual for checking if the event is upcoming
eventSchema.virtual("isUpcoming").get(function () {
  return this.date > new Date();
});

// Method for approving an event
eventSchema.methods.approveEvent = function () {
  this.status = EventStatus.APPROVED;
  return this.save();
};

export default model<IEvent>("Event", eventSchema);