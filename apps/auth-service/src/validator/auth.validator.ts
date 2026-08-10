import * as z from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),

  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),

  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters").max(100)
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),

  rememberMe: z.boolean().default(false)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
