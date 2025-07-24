import { getUserByAuth0Id } from "@db/users";

export async function verifyUserExists(auth0_id: string) {
  const user = await getUserByAuth0Id(auth0_id);
  if (user) {
    return user;
  } else {
    return undefined;
  }
}

export async function initializeUser(auth0_id: string) {
  return { auth0_id: auth0_id };
}

export async function initializeStudentAsTeacher(teacherId: string) {}
