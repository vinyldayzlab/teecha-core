import mongoose from "mongoose";
import { verifyUserExists } from "@routes/v1/users/service";
import mockingooseFn from "@tests/mockingoose-wrapper";
import type { IUser } from "@db/users";
import UserModel from "@db/users";
import { getTeacherByCode } from "@db/teachers";

describe("getTeacherByCode", () => {
  it("should return the teacherId if teacher_code exists", async () => {
    const teacher: Partial<IUser> & { _id: mongoose.Types.ObjectId } = {
      _id: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
    };
    mockingooseFn(UserModel).toReturn(teacher, "findOne");

    const results = await getTeacherByCode("ABC123");
    expect(results).toEqual(teacher);
  });

  it("should return undefined if teacher_code does not exist", async () => {
    mockingooseFn(UserModel).toReturn(undefined, "findOne");

    const results = await getTeacherByCode("ABC123");
    expect(results).toBeUndefined();
  });
});
