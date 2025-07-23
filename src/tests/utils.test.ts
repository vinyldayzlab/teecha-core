import { getErrorMessage } from "../utils";

describe("getErrorMessage", () => {
  test("should return message from Error instance", () => {
    const error = new Error("Something went wrong");
    expect(getErrorMessage(error)).toBe("Something went wrong");
  });

  test("should return message from an object with a message property", () => {
    const error = { message: "Custom error message" };
    expect(getErrorMessage(error)).toBe("Custom error message");
  });

  test("should return the error if its a string", () => {
    const error = "Some error";
    expect(getErrorMessage(error)).toBe("Some error");
  });

  test("should return fallback message for unknown error types", () => {
    const error = 42;
    expect(getErrorMessage(error)).toBe("An error occurred");
  });
});
