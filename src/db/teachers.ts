import { UserModel } from "./users";

export const getTeacherByCode = (code: string) =>
  UserModel.findOne({ teacher_code: code });
