"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";
import { loginSchema, type LoginFormData } from "../../src/validators/auth.validator";
import { AuthService } from "../../src/services/auth.service";
import { useAuthStore } from "../../src/stores/auth.store";
import type { AuthResponse } from "../../src/types/auth";
import { FormInput } from "./FormInput";
import { OAuthButtons } from "./OAuthButtons";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" }
  });

  const values = watch();

  async function onSubmit(data: LoginFormData) {
    setAuthError(null);
    try {
      const result = (await AuthService.login({
        email: data.email,
        password: data.password,
        rememberMe
      })) as AuthResponse;
      console.log("LOGIN RESULT", result);

      login(result.user, result.accessToken);
      console.log("STORE AFTER LOGIN", useAuthStore.getState());
      router.push("/dashboard");
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    }
  }

  const fieldMotion = (delay: number) => ({
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <motion.div {...fieldMotion(0.05)}>
        <FormInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          success={!!touchedFields.email && !errors.email && !!values.email}
          {...register("email")}
        />
      </motion.div>

      <motion.div {...fieldMotion(0.1)}>
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
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
          {...register("password")}
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
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
        >
          <AlertCircle size={14} className="shrink-0" />
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
