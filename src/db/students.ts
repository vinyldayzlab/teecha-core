import { Schema, Types } from "mongoose";

export type Student = {
  id: Types.ObjectId;
  name: string;
  email: string;
};

export const StudentSchema = new Schema<Student>(
  {
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false },
);
