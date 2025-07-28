import { describe, it, expect } from "vitest";
import { ObjectId } from "mongodb";
import ContractModel from "@db/contracts";
import { getPendingContractsByTeacherId, statusValues } from "@db/contracts";
import { setupTestDB } from "@tests/utils/database";

setupTestDB();

describe("getPendingContractsByTeacherId", () => {
  it("should return pending contracts for a given teacher_id", async () => {
    const teacherId = new ObjectId();

    const contract = await ContractModel.create({
      _id: new ObjectId(),
      teacher_id: teacherId,
      student_id: new ObjectId(),
      status: statusValues[0],
    });

    await ContractModel.create({
      _id: new ObjectId(),
      teacher_id: teacherId,
      student_id: new ObjectId(),
      status: statusValues[1],
    });

    const result = await getPendingContractsByTeacherId(teacherId.toString());

    expect(result).toHaveLength(1);
    expect(result[0]._id.toString()).toBe(contract._id.toString());
    expect(result[0].teacher_id.toString()).toBe(contract.teacher_id.toString());
    expect(result[0].status).toBe("PENDING");
  });

  it("should return an empty array if no pending contracts exist", async () => {
    const teacherId = new ObjectId();

    await ContractModel.create({
      _id: new ObjectId(),
      teacher_id: teacherId,
      student_id: new ObjectId(),
      status: statusValues[1],
    });

    const result = await getPendingContractsByTeacherId(teacherId.toString());
    expect(result).toEqual([]);
  });

  it("should return an empty array if the teacher_id has no contracts", async () => {
    const teacherId = new ObjectId();
    const result = await getPendingContractsByTeacherId(teacherId.toString());
    expect(result).toEqual([]);
  });
});
