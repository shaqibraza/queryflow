export type PasswordRequirementId = "length" | "uppercase" | "lowercase" | "number" | "special";

export interface PasswordRequirement {
  id: PasswordRequirementId;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "Minimum 8 characters",
    test: (value) => value.length >= 8
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (value) => /[A-Z]/.test(value)
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (value) => /[a-z]/.test(value)
  },
  {
    id: "number",
    label: "One number",
    test: (value) => /[0-9]/.test(value)
  },
  {
    id: "special",
    label: "One special character",
    test: (value) => /[^A-Za-z0-9]/.test(value)
  }
];

export type PasswordStrengthLabel = "Weak" | "Medium" | "Strong";

export function getPasswordStrength(value: string): {
  score: number;
  label: PasswordStrengthLabel;
  color: string;
} {
  const passed = PASSWORD_REQUIREMENTS.filter((req) => req.test(value)).length;

  if (!value) {
    return { score: 0, label: "Weak", color: "#EF4444" };
  }
  if (passed <= 2) {
    return { score: passed, label: "Weak", color: "#EF4444" };
  }
  if (passed <= 4) {
    return { score: passed, label: "Medium", color: "#F59E0B" };
  }
  return { score: passed, label: "Strong", color: "#22C55E" };
}
