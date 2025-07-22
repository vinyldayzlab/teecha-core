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
});
