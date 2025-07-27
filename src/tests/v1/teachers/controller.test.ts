import { validateTeacherController } from "@routes/v1/teachers/controller";
import { validateTeacher } from "@routes/v1/teachers/service";
import { describe, it, expect, vi, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("@routes/v1/teachers/service");

describe("validateTeacherController", () => {
  it("should respond with 200 and the teacherId when validation succeeds", async () => {
    const mockTeacherId = "a1b2c3d4e5f6g7h8i9j10";

    (validateTeacher as Mock).mockResolvedValue(mockTeacherId);

    const req = {
      body: { teacher_code: "ABC123" },
    } as Partial<Request>;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;

    const next = vi.fn() as NextFunction;

    await validateTeacherController(req as Request, res as Response, next);

    expect(validateTeacher).toHaveBeenCalledWith("ABC123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeacherId);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with an error when validation fails", async () => {
    const mockError = new Error("Validation failed");

    (validateTeacher as Mock).mockRejectedValue(mockError);

    const req = {
      body: { teacher_code: "N0TFND" },
    } as Partial<Request>;

    const res = {
      status: vi.fn(),
      json: vi.fn(),
    } as Partial<Response>;

    const next = vi.fn() as NextFunction;

    await validateTeacherController(req as Request, res as Response, next);

    expect(validateTeacher).toHaveBeenCalledWith("N0TFND");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
