export enum ResourceType {
    ALL = "all",
    CLASSROOM = "classroom",
    LAB = "lab",
    AUDITORIUM = "auditorium",
    VEHICLE = "vehicle",
    EQUIPMENT = "equipment",
    OTHER = "other",
  }
  
  export interface IResource {
    _id: string;
    name: string;
    type: ResourceType;
    building?: string;
    floor?: number;
    code: string;
    availability: boolean;
    vehicleNo?: string;
    count?: number;
    equipments?: string;
    createdAt: string;
    updatedAt: string;
  }
  