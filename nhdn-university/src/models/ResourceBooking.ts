export enum BookingStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  RETURNED = "returned"
}

  
export enum EnrolledModuleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

  
  export interface IResourceBooking {
    _id: string;
    userId: string;
    resourceId: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    subject?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  