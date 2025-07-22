import { getTeacherByCode } from "../../../db/teachers";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export async function validateTeacher(teacher_code: string) {
  const teacher = await getTeacherByCode(teacher_code);
  if (!teacher) {
    throw new EntityNotFoundError({
      message: "Teacher code not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }
  return teacher;
}
