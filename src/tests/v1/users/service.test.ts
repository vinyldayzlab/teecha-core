import { describe, it, expect } from "vitest";
import UserModel from "@db/users";
import { setupTestDB } from "@tests/utils/database";
import { initializeUser, verifyUserExists } from "@routes/v1/users/service";
import { ObjectId } from "mongodb";

setupTestDB();

describe("verifyUserExists", () => {
  it("should return the user if the auth0_id exists", async () => {
    const userData = {
      _id: new ObjectId("9473fb895f2117a96e755523"),
      auth0_id: "a1b2c3d4e5f6g7h8i9j10",
      teacher_code: "A1B2C3",
    };

    const createdUser = await UserModel.create(userData);

    const result = await verifyUserExists("a1b2c3d4e5f6g7h8i9j10");

    expect(result).toBeTruthy();
    expect(result?._id.toString()).toBe(createdUser._id.toString());
    expect(result?.auth0_id).toBe(createdUser.auth0_id);
    expect(result?.teacher_code).toBe(createdUser.teacher_code);
  });

  it("should return undefined if the auth0_id does not exist", async () => {
    const result = await verifyUserExists("nonexistentauth0id");
    expect(result).toBeUndefined();
  });
});

describe("initializeUser", () => {
  it("should return an object with the provided auth0_id", async () => {
    const auth0Id = "auth0|inituser123";

    const result = await initializeUser(auth0Id);

    expect(result).toEqual({ auth0_id: auth0Id });
  });
});
