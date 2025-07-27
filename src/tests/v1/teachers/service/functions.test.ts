vi.mock("@routes/v1/teachers/service/utils", async () => {
  const actual = await vi.importActual<typeof import("@routes/v1/teachers/service/utils")>("@routes/v1/teachers/service/utils");
  return {
    ...actual,
    generateRandomTeacherCode: vi.fn(),
    validateTeacherCode: vi.fn(),
  };
});

vi.mock("@db/teachers", async () => {
  const actual = await vi.importActual<typeof import("@db/teachers")>("@db/teachers");
  return {
    ...actual,
    getTeacherByCode: vi.fn(),
  };
});

import { generateTeacherCode } from "@routes/v1/teachers/service/functions";
import * as TeacherDb from "@db/teachers";
import * as TeacherServiceUtils from "@routes/v1/teachers/service/utils";
import { ObjectId } from "mongodb";
import CustomError from "@errors/CustomError";
import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";

describe("generateTeacherCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a unique valid code when first one is not taken", async () => {
    const mockCode = "JKL568";

    (TeacherServiceUtils.generateRandomTeacherCode as Mock).mockReturnValue(mockCode);
    (TeacherServiceUtils.validateTeacherCode as Mock).mockReturnValue(true);
    (TeacherDb.getTeacherByCode as Mock).mockResolvedValue(null);

    const result = await generateTeacherCode();
    expect(result).toBe(mockCode);
    expect(TeacherDb.getTeacherByCode).toHaveBeenCalledWith("JKL568");
  });

  it("should throw an error if generated code is invalid", async () => {
    (TeacherServiceUtils.validateTeacherCode as Mock).mockReturnValue(false);

    try {
      await generateTeacherCode();
      throw new Error("Forced error throw because expected generateTeacherCode to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      const authErr = err as CustomError<"ERR_VALID">;
      expect(authErr.message).toBe("Generated Teacher Code is not valid");
      expect(authErr.statusCode).toBe(500);
      expect(authErr.code).toBe("ERR_VALID");
    }
  });

  it("should retry up to 10 times if code is taken, then throw error", async () => {
    const mockCode = "NT4K3N";
    (TeacherServiceUtils.generateRandomTeacherCode as Mock).mockReturnValue(mockCode);
    (TeacherServiceUtils.validateTeacherCode as Mock).mockReturnValue(true);
    (TeacherDb.getTeacherByCode as Mock).mockResolvedValue({ _id: new ObjectId("a5eddee8b07fdf0d6e3179e6") });

    try {
      await generateTeacherCode();
      throw new Error("Forced error throw because expected generateTeacherCode to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      const authErr = err as CustomError<"ERR_VALID">;
      expect(authErr.message).toBe("Unable to generate unique teacher code");
      expect(authErr.statusCode).toBe(500);
      expect(authErr.code).toBe("ERR_VALID");
    }

    expect(TeacherServiceUtils.generateRandomTeacherCode).toHaveBeenCalledTimes(10);
    expect(TeacherDb.getTeacherByCode).toBeTruthy();
    expect(TeacherDb.getTeacherByCode).toHaveBeenCalledWith("NT4K3N");
    expect(TeacherDb.getTeacherByCode).toHaveBeenCalledTimes(10);
  });
});
