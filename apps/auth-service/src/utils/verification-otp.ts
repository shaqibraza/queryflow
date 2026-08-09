import crypto from "crypto";
import bcrypt from "bcrypt";

export function generateVerificationOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function hashVerificationOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyVerificationOtp(otp: string, hashedOtp: string): Promise<boolean> {
  return bcrypt.compare(otp, hashedOtp);
}
