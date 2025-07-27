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
