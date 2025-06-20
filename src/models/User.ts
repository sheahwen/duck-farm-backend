import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name?: string;
  email: string;
  image_url?: string;
  auth_id: string;
  provider?: string;
  created_at: Date;
  created_by: string;
}

const userSchema: Schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image_url: {
    type: String,
    required: false,
  },
  auth_id: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);
