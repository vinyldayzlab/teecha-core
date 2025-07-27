import { getTeacherByCode } from "@db/teachers";
import { generateRandomTeacherCode, validateTeacherCode } from "./utils";
import CustomError from "@errors/CustomError";

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
