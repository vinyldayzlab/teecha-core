import { getPendingStudentsByTeacherId } from "@db/teachers";
import EntityNotFoundError from "@errors/EntityNotFoundError";

export async function validateContract(
  teacher_id: string,
  student_email: string,
) {
  const students = await getPendingStudentsByTeacherId(teacher_id);
  if (!students) {
    throw new EntityNotFoundError({
      message: "This teacher doesn't have any pending students",
      statusCode: 404,
      code: "ERR_NF",
    });
  }

  // search inside the contract
  // const found = students.pending_students.find(
  //   (email) => email === student_email,
  // );

  // if (!found) {
  //   throw new EntityNotFoundError({
  //     message: "Student not found in teacher's pending contracts",
  //     statusCode: 404,
  //     code: "ERR_NF",
  //   });
  // } else {
  //   return {
  //     valid: true,
  //   };
  // }
}
