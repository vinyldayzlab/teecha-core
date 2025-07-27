import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserModel from "@db/users";
import { getTeacherByCode } from "@db/teachers";
import { ObjectId } from "mongodb";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error("Mongoose DB connection not established");
  }
  await mongoose.connection.db.dropDatabase();
});

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
