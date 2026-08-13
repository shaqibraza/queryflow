"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { AuthService } from "@/src/services/auth.service";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await AuthService.forgotPassword(email.trim());

      setSuccess(true);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border bg-white/[0.03] p-7 text-center backdrop-blur-xl"
        >
          <CheckCircle2 size={42} className="mx-auto text-success" />

          <h1 className="mt-5 text-2xl font-semibold">Check your email</h1>

          <p className="mt-2 text-sm text-muted">
            If an account exists with this email, we&apos;ve sent you a password reset link.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-accent to-accent-deep font-medium text-white transition hover:opacity-90"
          >
            Back to Login
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-white/[0.03] p-7 backdrop-blur-xl"
      >
        <div>
          <h1 className="text-2xl font-semibold">Forgot your password?</h1>

          <p className="mt-2 text-sm text-muted">
            Enter your email address and we&apos;ll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>

            <div className="relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-accent disabled:opacity-70"
              />
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
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-deep font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full text-center text-sm text-muted transition hover:text-foreground"
          >
            Back to Login
          </button>
        </form>
      </motion.div>
    </main>
  );
}
