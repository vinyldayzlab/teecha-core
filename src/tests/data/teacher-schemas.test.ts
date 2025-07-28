import { createTeacherSchema, validateTeacherSchema } from "@data/teacher-schemas";
import { describe, it, expect } from "vitest";

describe("validateTeacherSchema", () => {
  it("should pass with a valid teacher_code", () => {
    const result = validateTeacherSchema.validate({
      teacher_code: "ABC123",
    });
    expect(result.error).toBeUndefined();
  });

  it("should fail if teacher_code is missing", () => {
    const result = validateTeacherSchema.validate({});
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Teacher Code is required");
  });

  it("should fail if teacher_code is too short", () => {
    const result = validateTeacherSchema.validate({
      teacher_code: "A123",
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Teacher Code must have exactly 6 characters");
  });

  it("should fail if teacher_code is too long", () => {
    const result = validateTeacherSchema.validate({
      teacher_code: "ABC1234",
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Teacher Code must have exactly 6 characters");
  });

  it("should fail if teacher_code is empty", () => {
    const result = validateTeacherSchema.validate({
      teacher_code: "",
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Teacher Code must not be empty");
  });
});

describe("createTeacherSchema", () => {
  it("should pass with valid auth0_id and roles", () => {
    const result = createTeacherSchema.validate({
      auth0_id: "auth0|123456",
      roles: ["teacher"],
    });
    expect(result.error).toBeUndefined();
  });

  it("should fail if auth0_id is missing", () => {
    const result = createTeacherSchema.validate({
      roles: ["teacher"],
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Auth0 ID is required");
  });

  it("should fail if auth0_id is empty", () => {
    const result = createTeacherSchema.validate({
      auth0_id: "",
      roles: ["teacher"],
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Auth0 ID must not be empty");
  });

  it("should fail if roles is not an array", () => {
    const result = createTeacherSchema.validate({
      auth0_id: "auth0|123456",
      roles: "teacher",
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("Roles must be an array");
  });

  it("should fail if roles is an empty array", () => {
    const result = createTeacherSchema.validate({
      auth0_id: "auth0|123456",
      roles: [],
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe("At least one role is required");
  });

  it("should fail if role is not 'teacher'", () => {
    const result = createTeacherSchema.validate({
      auth0_id: "auth0|123456",
      roles: ["student"],
    });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toBe('Roles can only be "teacher"');
  });

  it("should fail if role is not a string", () => {
    const result = createTeacherSchema.validate(
      {
        auth0_id: "auth0|123456",
        roles: [123],
      },
      { abortEarly: false },
    );

    expect(result.error).toBeDefined();

    if (result.error) {
      const messages = result.error.details.map((d) => d.message);
      expect(messages).toContain("Role must be a string");
    }
  });
});
