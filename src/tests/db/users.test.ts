import mockingoose from "mockingoose";
import { verifyUserExists } from "../../routes/v1/users/service";
import { UserModel } from "../../db/users";
import mongoose from "mongoose";

describe("getUserByAuth0Id", () => {
  it("should return the user if its auth0_id exists", async () => {
    const user = {
      _id: new mongoose.Types.ObjectId("507f191e810c19729de860ea"),
      auth0_id: "abc123",
    };
    mockingoose(UserModel).toReturn(user, "findOne");
    const results = await verifyUserExists("abc123");
    expect(results).toEqual(user);
  });

  it("should return undefined if user does not exist", async () => {
    mockingoose(UserModel).toReturn(undefined, "findOne");
    const results = await verifyUserExists("abc123");
    expect(results).toEqual(undefined);
  });
});
