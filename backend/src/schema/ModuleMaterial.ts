import { model, Schema } from "mongoose";
import { IModuleMaterial, ModuleMaterialType } from "../modal/IModuleMaterial";

const moduleMaterialSchema = new Schema<IModuleMaterial>(
    {
      title: { type: String, required: true },
      description: { type: String },
      type: {
        type: String,
        enum: Object.values(ModuleMaterialType),
        required: true,
      },
      moduleId: {
        type: Schema.Types.ObjectId,
        ref: "Module",
        required: true,
      },
      fileUrl: { type: String }, // Assignment instructions or resources
      dueDate: { type: Date }, // Due date for the assignment
    },
    {
      timestamps: true,
    }
  );
  
  export const ModuleMaterial = model<IModuleMaterial>(
    "ModuleMaterial",
    moduleMaterialSchema
  );