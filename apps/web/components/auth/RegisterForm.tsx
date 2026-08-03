"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { PASSWORD_REQUIREMENTS } from "@/lib/password";
import { FormInput } from "./FormInput";
import { OAuthButtons } from "./OAuthButtons";
import { PasswordStrength } from "./PasswordStrength";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export function RegisterForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordValid = useMemo(
    () => PASSWORD_REQUIREMENTS.every((req) => req.test(values.password)),
    [values.password]
  );

  const errors: FormErrors = useMemo(() => {
    const next: FormErrors = {};
    if (touched.firstName && !values.firstName.trim()) {
      next.firstName = "First name is required.";
    }
    if (touched.lastName && !values.lastName.trim()) {
      next.lastName = "Last name is required.";
    }
    if (touched.email) {
      if (!values.email.trim()) next.email = "Email address is required.";
      else if (!EMAIL_PATTERN.test(values.email)) next.email = "Enter a valid email address.";
    }
    if (touched.password && !passwordValid) {
      next.password = "Password doesn't meet the requirements below.";
    }
    if (touched.confirmPassword && values.confirmPassword !== values.password) {
      next.confirmPassword = "Passwords don't match.";
    }
    return next;
  }, [touched, values, passwordValid]);

  const isFormValid =
    values.firstName.trim() &&
    values.lastName.trim() &&
    EMAIL_PATTERN.test(values.email) &&
    passwordValid &&
    values.confirmPassword === values.password;

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    if (!isFormValid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  const fieldMotion = (delay: number) => ({
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const }
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-3 py-10 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-foreground">Account created</h3>
        <p className="max-w-[280px] text-[13.5px] leading-relaxed text-muted">
          Check {values.email || "your inbox"} to verify your email and start querying your
          databases.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div {...fieldMotion(0.05)}>
          <FormInput
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            placeholder="Ada"
            value={values.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            error={errors.firstName}
            success={touched.firstName && !errors.firstName && !!values.firstName}
          />
        </motion.div>
        <motion.div {...fieldMotion(0.1)}>
          <FormInput
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Lovelace"
            value={values.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            error={errors.lastName}
            success={touched.lastName && !errors.lastName && !!values.lastName}
          />
        </motion.div>
      </div>

      <motion.div {...fieldMotion(0.15)}>
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          success={touched.email && !errors.email && !!values.email}
        />
      </motion.div>

      <motion.div {...fieldMotion(0.2)}>
        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              suppressHydrationWarning
              className="focus-ring rounded-md p-1 text-muted transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />
        <PasswordStrength password={values.password} />
      </motion.div>

      <motion.div {...fieldMotion(0.25)}>
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          success={touched.confirmPassword && !errors.confirmPassword && !!values.confirmPassword}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              suppressHydrationWarning
              className="focus-ring rounded-md p-1 text-muted transition-colors hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        whileHover={{ y: isSubmitting ? 0 : -1 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        suppressHydrationWarning
        className="focus-ring flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-deep text-[14.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Or</span>
        <span className="h-px flex-1 bg-border" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <OAuthButtons />
      </motion.div>
    </form>
  );
}
