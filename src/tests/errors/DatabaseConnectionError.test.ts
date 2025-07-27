import CustomError from "@errors/CustomError";
import DatabaseConnectionError from "@errors/DatabaseConnectionError";
import { describe, it, expect } from "vitest";

describe("DatabaseConnectionError", () => {
  const mockError = {
    message: "Connection failed",
    statusCode: 500,
    code: "ERR_DB" as const,
  };

  const error = new DatabaseConnectionError(mockError);

  it("should have the correct message, statusCode, and code", () => {
    expect(error.message).toBe("Connection failed");
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("ERR_DB");
  });

  it("should be an instance of DatabaseConnectionError", () => {
    expect(error).toBeInstanceOf(DatabaseConnectionError);
  });

  it("should be an instance of CustomError", () => {
    expect(error).toBeInstanceOf(CustomError);
  });
});
