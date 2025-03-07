import { ResourceType } from "../enums/ResourceType";

export interface IResource {
    _id?: string;
    name: string;
    type: ResourceType;
    availability: boolean;
  }
  