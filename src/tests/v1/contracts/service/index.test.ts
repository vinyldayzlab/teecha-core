import { describe, it, expect, vi, type Mock } from "vitest";
import EntityNotFoundError from "@errors/EntityNotFoundError";
import { Types } from "mongoose";

vi.mock("@db/contracts", async () => {
  const actual = await vi.importActual<typeof import("@db/contracts")>("@db/contracts");
  return {
    ...actual,
    getPendingContractsByTeacherId: vi.fn(),
  };
});

import { getPendingContractsByTeacherId, statusValues } from "@db/contracts";
import { getPendingContracts } from "@routes/v1/contracts/service";

describe("getPendingContracts", () => {
  const teacherId = new Types.ObjectId();
  const studentEmail = "john@example.com";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return pending contracts if they exist", async () => {
    const mockContracts = [
      {
        _id: new Types.ObjectId(),
        teacher_id: teacherId,
        status: statusValues[0],
        student: {
          email: studentEmail,
        },
      },
    ];

    (getPendingContractsByTeacherId as Mock).mockResolvedValue(mockContracts);

    const result = await getPendingContracts(teacherId.toString(), studentEmail);

    expect(result).toEqual(mockContracts);
    expect(result).toBeTruthy();
  });

  it("should throw an EntityNotFoundError if no pending contracts exist", async () => {
    const teacherId = new Types.ObjectId();
    const studentEmail = "nonexistent@example.com";

    (getPendingContractsByTeacherId as Mock).mockResolvedValue([]);

    await expect(getPendingContracts(teacherId.toString(), studentEmail)).rejects.toThrowError(
      new EntityNotFoundError({
        message: "This teacher doesn't have any pending contracts",
        statusCode: 404,
        code: "ERR_NF",
      }),
    );

    expect(getPendingContractsByTeacherId).toHaveBeenCalledWith(teacherId.toString(), studentEmail);
  });

  it("should throw an EntityNotFoundError when there are no contracts for the teacher", async () => {
    const teacherId = new Types.ObjectId();
    const studentEmail = "nonexistent@example.com";

    (getPendingContractsByTeacherId as Mock).mockResolvedValue([]);

    await expect(getPendingContracts(teacherId.toString(), studentEmail)).rejects.toThrowError(
      new EntityNotFoundError({
        message: "This teacher doesn't have any pending contracts",
        statusCode: 404,
        code: "ERR_NF",
      }),
    );
  });
});
