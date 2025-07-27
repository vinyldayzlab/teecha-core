import { describe, it, expect } from "vitest";
import { setupTestDB } from "@tests/utils/database";
import UserModel, { getUserByAuth0Id } from "@db/users";
import { ObjectId } from "mongodb";

setupTestDB();

describe("getUserByAuth0Id", () => {
  it("should return the user with the given auth0_id", async () => {
    const userData = {
      _id: new ObjectId("9473fb895f2117a96e755523"),
      auth0_id: "a1b2c3d4e5f6g7h8",
      teacher_code: "TCH001",
    };

    const createdUser = await UserModel.create(userData);

    const result = await getUserByAuth0Id("a1b2c3d4e5f6g7h8");

    expect(result).toBeTruthy();
    expect(result?._id.toString()).toBe(createdUser._id.toString());
    expect(result?.auth0_id).toBe(createdUser.auth0_id);
    expect(result?.teacher_code).toBe(createdUser.teacher_code);
  });

  it("should return null if no user is found with the given auth0_id", async () => {
    const result = await getUserByAuth0Id("nonExistentId");
    expect(result).toBeNull();
  });
});
