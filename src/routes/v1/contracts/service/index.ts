import { getPendingContractsByTeacherId } from "@db/contracts";
import EntityNotFoundError from "@errors/EntityNotFoundError";

export async function getPendingContracts(teacherId: string, studentEmail?: string) {
  const pendingContracts = await getPendingContractsByTeacherId(teacherId, studentEmail);
  console.log(pendingContracts);
  if (pendingContracts.length === 0) {
    throw new EntityNotFoundError({
      message: "This teacher doesn't have any pending contracts",
      statusCode: 404,
      code: "ERR_NF",
    });
  } else {
    return pendingContracts;
  }
}
