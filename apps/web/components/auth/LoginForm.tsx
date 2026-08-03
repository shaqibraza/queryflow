"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { FormInput } from "./FormInput";
import { OAuthButtons } from "./OAuthButtons";

interface FormState {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: FormState = {
  email: "",
  password: ""
};

export function LoginForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const errors: FormErrors = useMemo(() => {
    const next: FormErrors = {};
    if (touched.email) {
      if (!values.email.trim()) next.email = "Email address is required.";
      else if (!EMAIL_PATTERN.test(values.email)) next.email = "Enter a valid email address.";
    }
    if (touched.password && !values.password) {
      next.password = "Password is required.";
    }
    return next;
  }, [touched, values]);

  const isFormValid = EMAIL_PATTERN.test(values.email) && values.password.length > 0;

  function handleChange(field: keyof FormState, value: string) {
    setAuthError(null);
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setAuthError(null);
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
        <h3 className="text-[17px] font-semibold text-foreground">Welcome back</h3>
        <p className="max-w-[280px] text-[13.5px] leading-relaxed text-muted">
          You're signed in as {values.email || "your account"}. Redirecting you to your databases.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <motion.div {...fieldMotion(0.05)}>
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

      <motion.div {...fieldMotion(0.1)}>
        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
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
        <div className="mt-1.5 flex justify-end">
          <a
            href="/forgot-password"
            className="focus-ring rounded-md text-[12.5px] font-medium text-accent transition-colors hover:text-accent-deep"
          >
            Forgot password?
          </a>
        </div>
      </motion.div>

      <motion.div {...fieldMotion(0.15)} className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            suppressHydrationWarning
            className="focus-ring h-4 w-4 rounded border-border text-accent accent-accent"
          />
          Remember me
        </label>
      </motion.div>

      {authError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-danger/10 px-3 py-2 text-[13px] text-danger"
        >
          {authError}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        whileHover={{ y: isSubmitting ? 0 : -1 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        suppressHydrationWarning
        className="focus-ring flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-deep text-[14.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Or</span>
        <span className="h-px flex-1 bg-border" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <OAuthButtons />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="text-center text-[13px] text-muted"
      >
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="focus-ring rounded-md font-semibold text-accent transition-colors hover:text-accent-deep"
        >
          Create one
        </a>
      </motion.p>
    </form>
  );
}
