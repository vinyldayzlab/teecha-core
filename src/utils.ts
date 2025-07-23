export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}

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
