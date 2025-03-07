import { Schema, model } from "mongoose";
import { IMessage } from "../modal/IMessage";

const messageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
},{
    timestamps: true
});

export default model<IMessage>("Message", messageSchema);
