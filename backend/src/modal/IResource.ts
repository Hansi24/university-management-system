import { ResourceType } from "../enums/ResourceType";

export interface IResource {
    _id?: string;
    name: string;
    code: string;
    type: ResourceType;
    availability: boolean;
    building?: string;
    floor?: number;
    vehicleNo?: string;
    count?: number;
    equipments?: string;
  }
  