import { ObjectId } from "mongoose";
import { NotificationType } from "../enums/NotificationType";
import { NotificationStatus } from "../enums/NotificationStatus";

export interface INotification {
    _id?: string;
    userId: ObjectId; 
    type: NotificationType;
    message: string;
    status: NotificationStatus;
    createdAt?: Date;
  }
  