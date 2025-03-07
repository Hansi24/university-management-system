import { Schema, model } from "mongoose";
import { IFile } from "../modal/IFile";
import { FileType } from "../enums/FileType";

const fileSchema = new Schema<IFile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileType: { type: String, enum: Object.values(FileType), required: true },
  url: { type: String, required: true }, // Firebase Storage URL
},
{
    timestamps: true
});

export default model<IFile>("File", fileSchema);
