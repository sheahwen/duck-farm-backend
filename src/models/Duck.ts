import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IDuck extends Document {
  name: string;
  description: string;
  created_at: Date;
  created_by: string;
  user_id: IUser["_id"];
  image_url: string;
}

const duckSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IDuck>("Duck", duckSchema);
