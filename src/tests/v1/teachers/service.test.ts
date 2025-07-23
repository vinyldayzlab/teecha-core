import {
  generateRandomTeacherCode,
  validateTeacherCode,
} from "../../../routes/v1/teachers/service";

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
