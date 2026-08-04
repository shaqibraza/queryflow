"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";
import { registerSchema, type RegisterFormData } from "../../src/validators/auth.validator";
import { AuthService } from "../../src/services/auth.service";
import { FormInput } from "./FormInput";
import { OAuthButtons } from "./OAuthButtons";
import { PasswordStrength } from "./PasswordStrength";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Watched only to drive success ticks + the live password strength meter.
  const values = watch();

  async function onSubmit(data: RegisterFormData) {
    setSubmitError(null);
    try {
      await AuthService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });

      toast.success("Account created successfully.");
      router.push("/login");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  }

  const fieldMotion = (delay: number) => ({
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.div {...fieldMotion(0.05)}>
          <FormInput
            label="First Name"
            autoComplete="given-name"
            placeholder="Ada"
            error={errors.firstName?.message}
            success={!!touchedFields.firstName && !errors.firstName && !!values.firstName}
            {...register("firstName")}
          />
        </motion.div>
        <motion.div {...fieldMotion(0.1)}>
          <FormInput
            label="Last Name"
            autoComplete="family-name"
            placeholder="Lovelace"
            error={errors.lastName?.message}
            success={!!touchedFields.lastName && !errors.lastName && !!values.lastName}
            {...register("lastName")}
          />
        </motion.div>
      </div>

      <motion.div {...fieldMotion(0.15)}>
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

      <motion.div {...fieldMotion(0.2)}>
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a strong password"
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
        <PasswordStrength password={values.password} />
      </motion.div>

      <motion.div {...fieldMotion(0.25)}>
        <FormInput
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          success={
            !!touchedFields.confirmPassword && !errors.confirmPassword && !!values.confirmPassword
          }
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
          {...register("confirmPassword")}
        />
      </motion.div>

      {submitError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
        >
          <AlertCircle size={14} className="shrink-0" />
          {submitError}
        </motion.p>
      )}

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
