import type { IContract } from "@db/contracts";
import EntityNotFoundError from "@errors/EntityNotFoundError";

export function validateStudent(pendingContracts: IContract[], student_email: string) {
  const matchingContracts = pendingContracts.filter((contract) => contract.student.email === student_email);
  if (matchingContracts.length === 0) {
    throw new EntityNotFoundError({
      message: "No pending contract found for this student email",
      statusCode: 404,
      code: "ERR_NF",
    });
  } else {
    return {
      valid: true,
      contracts: matchingContracts,
    };
  }
}
