import teachers from "@routes/v1/teachers";
import { generateRandomTeacherCode, validateTeacherCode } from "@/routes/v1/teachers/service";
import express, { type NextFunction, type Request, type Response } from "express";
import request from "supertest";

vi.mock("@routes/v1/teachers/controller", async () => {
  const actual = await vi.importActual<typeof import("@routes/v1/teachers/controller")>("@routes/v1/teachers/controller");

  return {
    ...actual,
    validateTeacherController: (req: Request, res: Response) => {
      res.status(200).json({ _id: "a1b2c3d4e5f6g7h8i9j10" });
    },
  };
});

describe("POST /teachers/validate", () => {
  const app = express();
  app.use(express.json());
  app.use("/teachers", teachers);

  it("should return 200 and teacherId when authorized", async () => {
    const response = await request(app).post("/teachers/validate").send({ teacher_code: "ABC123" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id: "a1b2c3d4e5f6g7h8i9j10" });
  });
});

describe("generateRandomTeacherCode", () => {
  it("generates a code of length 6", () => {
    const code = generateRandomTeacherCode();
    expect(code).toHaveLength(6);
  });

  it("generates codes containing only uppercase letters and digits", () => {
    const code = generateRandomTeacherCode();
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it("generates different codes on multiple calls", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateRandomTeacherCode());
    }
    // It's highly unlikely all 100 codes are identical
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("validateTeacherCode", () => {
  it("returns true for valid codes (6 uppercase letters or digits)", () => {
    expect(validateTeacherCode("ABC123")).toBe(true);
    expect(validateTeacherCode("XYZ789")).toBe(true);
    expect(validateTeacherCode("A1B2C3")).toBe(true);
    expect(validateTeacherCode("123456")).toBe(true);
    expect(validateTeacherCode("ABCDEF")).toBe(true);
  });

  it("returns false for codes with lowercase letters", () => {
    expect(validateTeacherCode("abc123")).toBe(false);
    expect(validateTeacherCode("AbC123")).toBe(false);
  });

  it("returns false for codes with special characters", () => {
    expect(validateTeacherCode("ABC!23")).toBe(false);
    expect(validateTeacherCode("AB@#12")).toBe(false);
  });

  it("returns false for codes with wrong length", () => {
    expect(validateTeacherCode("ABCDE")).toBe(false);
    expect(validateTeacherCode("ABCDEFG")).toBe(false);
    expect(validateTeacherCode("")).toBe(false);
  });
});
