import CustomError from "@errors/CustomError";

describe("CustomError", () => {
  it("should create an error with message and status code", () => {
    const error = new CustomError({
      message: "Something went wrong",
      statusCode: 500,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.code).toBeUndefined();
  });

  it("should include the custom error code if provided", () => {
    const error = new CustomError({
      message: "Not found",
      statusCode: 404,
      code: "ERR_NF",
    });

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("ERR_NF");
  });
});
