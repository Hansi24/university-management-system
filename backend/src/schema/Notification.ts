import { Schema, model } from "mongoose";
import { INotification } from "../modal/INotification";
import { NotificationType } from "../enums/NotificationType";
import { NotificationStatus } from "../enums/NotificationStatus";

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  message: { type: String, required: true },
  status: { type: String, enum: Object.values(NotificationStatus), default: NotificationStatus.PENDING },
},{
    timestamps: true
});

export default model<INotification>("Notification", notificationSchema);
