import { teacherId } from "@data/joi-validations";
import { describe, it, expect } from "vitest";

describe("teacherId schema", () => {
  it("should validate a correct ObjectId", () => {
    const result = teacherId.validate("507f1f77bcf86cd799439011");
    expect(result.error).toBeUndefined();
  });

  it("should reject a short string", () => {
    const result = teacherId.validate("123");
    expect(result.error?.details[0].message).toBe("Teacher ID must be a valid 24-character hex string");
  });

  it("should reject an empty string", () => {
    const result = teacherId.validate("");
    expect(result.error?.details[0].message).toBe("Teacher ID must not be empty");
  });

  it("should reject missing value", () => {
    const result = teacherId.validate(undefined);
    expect(result.error?.details[0].message).toBe("Teacher ID is required");
  });

  it("should reject invalid characters", () => {
    const result = teacherId.validate("z07f1f77bcf86cd799439011");
    expect(result.error?.details[0].message).toBe("Teacher ID must be a valid 24-character hex string");
  });
});
