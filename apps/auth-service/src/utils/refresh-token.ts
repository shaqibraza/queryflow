import { comparePassword, hashPassword } from "./password.js";

export const hashRefreshToken = async (token: string) => {
  return hashPassword(token);
};

export const compareRefreshToken = async (token: string, hashedToken: string) => {
  return comparePassword(token, hashedToken);
};
