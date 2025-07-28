import { describe, it, expect } from "vitest";
import { ObjectId } from "mongodb";
import ContractModel from "@db/contracts";
import { getPendingContractsByTeacherId, statusValues } from "@db/contracts";
import { setupTestDB } from "@tests/utils/database";
import { Types } from "mongoose";

setupTestDB();

describe("getPendingContractsByTeacherId", () => {
  it("should return pending contracts for a given teacher_id", async () => {
    const teacherId = new Types.ObjectId();

    const contract = await ContractModel.create({
      _id: new Types.ObjectId(),
      teacher_id: teacherId,
      student: {
        id: new Types.ObjectId(),
        name: "John Doe",
        email: "john@example.com",
      },
      status: statusValues[0],
    });

    await ContractModel.create({
      _id: new Types.ObjectId(),
      teacher_id: teacherId,
      student: {
        id: new Types.ObjectId(),
        name: "Jane Smith",
        email: "jane@example.com",
      },
      status: statusValues[1],
    });

    const result = await getPendingContractsByTeacherId(teacherId.toString());

    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]._id.toString()).toBe(contract._id.toString());
    expect(result[0].status).toBe("PENDING");
    expect(result[0].student.email).toBe("john@example.com");
  });

  it("should return pending contracts for a teacher filtered by student_email", async () => {
    const teacherId = new Types.ObjectId();

    const contract = await ContractModel.create({
      _id: new Types.ObjectId(),
      teacher_id: teacherId,
      student: {
        id: new Types.ObjectId(),
        name: "John Doe",
        email: "john@example.com",
      },
      status: statusValues[0],
    });

    await ContractModel.create({
      _id: new Types.ObjectId(),
      teacher_id: teacherId,
      student: {
        id: new Types.ObjectId(),
        name: "Jane Smith",
        email: "jane@example.com",
      },
      status: statusValues[0],
    });

    const result = await getPendingContractsByTeacherId(teacherId.toString(), "john@example.com");

    expect(result).toHaveLength(1);
    expect(result[0]._id.toString()).toBe(contract._id.toString());
    expect(result[0].student.email).toBe("john@example.com");
    expect(result[0].teacher_id.toString()).toBe(teacherId.toString());
    expect(result[0].status).toBe("PENDING");
  });

  it("should return an empty array if no pending contracts exist", async () => {
    const teacherId = new ObjectId();

    await ContractModel.create({
      _id: new Types.ObjectId(),
      teacher_id: teacherId,
      student: {
        id: new Types.ObjectId(),
        name: "Inactive Student",
        email: "inactive@example.com",
      },
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
