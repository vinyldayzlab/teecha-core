import mongoose, { Schema, Types } from "mongoose";

export const statusValues = ["PENDING", "ACTIVE", "CANCELLED"] as const;
type ContractStatus = (typeof statusValues)[number];

export interface IContract extends Document {
  _id: Types.ObjectId;
  teacher_id: Types.ObjectId;
  student_id: Types.ObjectId;
  status: ContractStatus;
}

const contractsSchema = new mongoose.Schema<IContract>({
  _id: { type: Schema.Types.ObjectId, required: true },
  teacher_id: { type: Schema.Types.ObjectId, required: true },
  student_id: { type: Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "CANCELLED"],
    required: true,
  },
});

const contractsCollection = "contracts";
const ContractModel = (mongoose.models.Contract as mongoose.Model<IContract>) || mongoose.model("Contract", contractsSchema, contractsCollection);
export default ContractModel;

export const getPendingContractsByTeacherId = (teacherId: string) => ContractModel.find({ teacher_id: teacherId, status: statusValues[0] });
