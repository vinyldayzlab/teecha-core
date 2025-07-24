import UserModel from "@/db/users";
import * as mockingoose from "mockingoose";

type ModelType = typeof UserModel;
type MethodType = "findOne" | "find" | "update" | "save" | string;

type MockingooseFn = (model: ModelType) => {
  toReturn: (data: unknown, method?: MethodType) => void;
};

const mockingooseFn: MockingooseFn = ("default" in mockingoose ? mockingoose.default : mockingoose) as MockingooseFn;

export default mockingooseFn;
