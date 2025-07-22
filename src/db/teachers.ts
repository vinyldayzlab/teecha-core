import { UserModel } from "./users";

export const getTeacherByCode = (code: string) =>
  UserModel.findOne({ teacher_code: code }).select("_id").lean();

export const getPendingStudentsByTeacherId = (teacherId: string) =>
  UserModel.findById({ _id: teacherId }).select("pending_students").lean();
