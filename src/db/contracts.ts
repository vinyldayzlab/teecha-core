import mongoose, { Schema, Types, type FilterQuery } from "mongoose";
import { StudentSchema, type Student } from "@db/students";

export const statusValues = ["PENDING", "ACTIVE", "CANCELLED"] as const;
type ContractStatus = (typeof statusValues)[number];

export interface IContract extends Document {
  _id: Types.ObjectId;
  teacher_id: Types.ObjectId;
  student: Student;
  student_email?: string;
  status: ContractStatus;
}

const contractsSchema = new mongoose.Schema<IContract>({
  _id: { type: Schema.Types.ObjectId, required: true },
  teacher_id: { type: Schema.Types.ObjectId, required: true },
  student: { type: StudentSchema, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "CANCELLED"],
    required: true,
  },
});

const contractsCollection = "contracts";
const ContractModel = (mongoose.models.Contract as mongoose.Model<IContract>) || mongoose.model("Contract", contractsSchema, contractsCollection);
export default ContractModel;

export const getPendingContractsByTeacherId = (teacherId: string, studentEmail?: string) => {
  const query: FilterQuery<IContract> = {
    teacher_id: new Types.ObjectId(teacherId),
    status: statusValues[0],
  };

  if (studentEmail) {
    query["student.email"] = studentEmail;
  }

  return ContractModel.find(query).select("_id teacher_id status student.email");
};
