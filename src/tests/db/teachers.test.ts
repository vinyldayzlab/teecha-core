import { describe, it, expect } from "vitest";
import UserModel from "@db/users";
import { getTeacherByCode } from "@db/teachers";
import { ObjectId } from "mongodb";
import { setupTestDB } from "@tests/utils/database";

setupTestDB();

describe("getTeacherByCode", () => {
  it("should return the _id of the teacher with the given code", async () => {
    const teacher = await UserModel.create({
      _id: new ObjectId("9473fb895f2117a96e755523"),
      auth0_id: "a1b2c3d4e5f6g7h8",
      teacher_code: "ABC123",
    });

    const result = await getTeacherByCode("ABC123");

    expect(result).toBeTruthy();
    expect(result?._id.toString()).toBe(teacher._id.toString());
  });

  it("should return null if no teacher is found with the given code", async () => {
    const result = await getTeacherByCode("NOT_FOUND");
    expect(result).toBeNull();
  });
});
