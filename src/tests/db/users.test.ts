import mongoose from "mongoose";
import type { IUser } from "@db/users";
import UserModel from "@db/users";
import { verifyUserExists } from "@routes/v1/users/service";
import mockingooseFn from "@/tests/mockingoose-wrapper";

describe("getUserByAuth0Id", () => {
  it("should return the user if its auth0_id exists", async () => {
    const user: Partial<IUser> & { _id: mongoose.Types.ObjectId } = {
      _id: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      auth0_id: "abc123",
    };
    mockingooseFn(UserModel).toReturn(user, "findOne");

    const results = await verifyUserExists("abc123");
    expect(results).toEqual(user);
  });

  it("should return undefined if user does not exist", async () => {
    mockingooseFn(UserModel).toReturn(null, "findOne");

    const results = await verifyUserExists("abc123");
    expect(results).toBeUndefined();
  });
});
