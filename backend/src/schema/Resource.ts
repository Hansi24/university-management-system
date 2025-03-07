import { Schema, model } from "mongoose";
import { IResource } from "../modal/IResource";
import { ResourceType } from "../enums/ResourceType";

const resourceSchema = new Schema<IResource>({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(ResourceType), required: true },
  availability: { type: Boolean, default: true }
});

export default model<IResource>("Resource", resourceSchema);
