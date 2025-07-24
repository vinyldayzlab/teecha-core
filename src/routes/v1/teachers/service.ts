import { getTeacherByCode } from "@db/teachers";
import { createUser } from "@db/users";
import AuthenticationError from "@errors/AuthenticationError";
import CustomError from "@errors/CustomError";
import DatabaseOperationError from "@errors/DatabaseOperationError";
import EntityNotFoundError from "@errors/EntityNotFoundError";
import { initializeUser, verifyUserExists } from "@routes/v1/users/service";

export function generateRandomTeacherCode(): string {
  const CODE_LENGTH = 6;
  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code += CHARSET[randomIndex];
  }
  return code;
}

export const validateTeacherCode = (code: string): boolean => {
  const regex = /^[A-Z0-9]{6}$/;
  return regex.test(code);
};

export async function initializeTeacher(auth0_id: string, roles: string[]) {
  const user = await verifyUserExists(auth0_id);
  let userInfo = {};
  if (!user) {
    const defaultUserInfo = await initializeUser(auth0_id);
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
        message: "User is not a teacher.",
        statusCode: 500,
        code: "ERR_AUTH",
      });
    }
  } else {
    throw new AuthenticationError({
      message: "User is already in the database.",
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

export async function generateTeacherCode() {
  let code = generateRandomTeacherCode();
  let attempts = 0;
  while (attempts < 10) {
    if (validateTeacherCode(code)) {
      const teacher = await getTeacherByCode(code);
      if (!teacher) {
        return code;
      } else {
        code = generateRandomTeacherCode();
      }
    } else {
      throw new CustomError({
        message: "Generated Teacher Code is not valid",
        statusCode: 500,
        code: "ERR_VALID",
      });
    }
    attempts++;
  }
  throw new CustomError({
    message: "Unable to generate unique teacher code",
    statusCode: 500,
    code: "ERR_VALID",
  });
}
