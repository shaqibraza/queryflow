"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { AuthService } from "@/src/services/auth.service";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);

    if (!token) {
      setError("This password reset link is invalid or missing.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await AuthService.resetPassword({
        token,
        password,
        confirmPassword
      });

      setSuccess(true);

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-white/[0.03] p-7 text-center backdrop-blur-xl"
      >
        <CheckCircle2 size={42} className="mx-auto text-success" />

        <h1 className="mt-5 text-2xl font-semibold">Password reset successfully</h1>

        <p className="mt-2 text-sm text-muted">
          Your password has been changed. Redirecting you to login...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl border border-border bg-white/[0.03] p-7 backdrop-blur-xl"
    >
      <div>
        <h1 className="text-2xl font-semibold">Reset your password</h1>

        <p className="mt-2 text-sm text-muted">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {/* New Password */}

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            New Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm outline-none transition focus:border-accent disabled:opacity-70"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm outline-none transition focus:border-accent disabled:opacity-70"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] text-danger">
            <AlertCircle size={14} className="shrink-0" />

            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
