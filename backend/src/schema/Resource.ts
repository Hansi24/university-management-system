import { Schema, model } from "mongoose";
import { IResource } from "../modal/IResource";
import { ResourceType } from "../enums/ResourceType";

const resourceSchema = new Schema<IResource>({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(ResourceType), required: true },
  building:{type: String, required(): boolean { return this.type === ResourceType.CLASSROOM || this.type === ResourceType.LAB || this.type === ResourceType.AUDITORIUM; }},
  floor: { type: Number, required(): boolean { return this.type === ResourceType.CLASSROOM || this.type === ResourceType.LAB || this.type === ResourceType.AUDITORIUM; }},
  code: { type: String, required: true },
  availability: { type: Boolean, default: true },
  vehicleNo: { type: String, required(): boolean { return this.type === ResourceType.VEHICLE; }},
  count: { type: Number, required(): boolean { return this.type === ResourceType.EQUIPMENT; }},
  equipments: { type: String, required(): boolean { return this.type === ResourceType.EQUIPMENT; }},
}, {
  timestamps: true,
});

export default model<IResource>("Resource", resourceSchema);
