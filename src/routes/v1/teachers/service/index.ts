import { getTeacherByCode } from "@db/teachers";
import { createUser } from "@db/users";
import AuthenticationError from "@errors/AuthenticationError";
import DatabaseOperationError from "@errors/DatabaseOperationError";
import EntityNotFoundError from "@errors/EntityNotFoundError";
import { initializeUser, verifyUserExists } from "@routes/v1/users/service";
import { generateTeacherCode } from "./functions";

export async function initializeTeacher(auth0_id: string, roles: string[]) {
  const user = await verifyUserExists(auth0_id);
  let userInfo = {};
  if (!user) {
    const defaultUserInfo = initializeUser(auth0_id);
    userInfo = { ...userInfo, ...defaultUserInfo };
    if (roles.includes("teacher")) {
      const teacherInfo = {
        contracts: [],
        teacher_code: await generateTeacherCode(),
      };
      userInfo = { ...userInfo, ...teacherInfo };
      const newUser = await createUser(userInfo);
      if (!newUser) {
        throw new DatabaseOperationError({
          message: "Could not create user",
          statusCode: 500,
          code: "ERR_DB",
        });
      }
      return newUser;
    } else {
      throw new AuthenticationError({
        message: "User is not a teacher",
        statusCode: 500,
        code: "ERR_AUTH",
      });
    }
  } else {
    throw new AuthenticationError({
      message: "User is already in the database",
      statusCode: 500,
      code: "ERR_AUTH",
    });
  }
}

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
