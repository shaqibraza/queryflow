"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { AuthService } from "@/src/services/auth.service";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";
``;
export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [verified, setVerified] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);

  /*
   * Countdown
   */
  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendCooldown]);

  /*
   * Verify OTP
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setIsSubmitting(true);

      await AuthService.verifyEmail({
        email,
        otp
      });

      setVerified(true);

      toast.success("Email verified successfully!");

      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * Resend OTP
   */
  async function handleResend() {
    if (!email || isResending || resendCooldown > 0 || verified) {
      return;
    }

    setError(null);

    try {
      setIsResending(true);

      await AuthService.resendVerificationOtp(email);

      toast.success("A new verification code has been sent.");

      setOtp("");

      // Prevent repeated requests
      setResendCooldown(60);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        className="w-full max-w-md rounded-2xl border border-border bg-white/[0.03] p-6 backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Verify your email</h1>

          <p className="mt-2 text-sm text-muted">We sent a 6-digit verification code to</p>

          <p className="mt-1 break-all text-sm font-medium text-foreground">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-foreground">
              Verification code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                setOtp(value);
              }}
              placeholder="000000"
              disabled={isSubmitting || verified}
              className="focus-ring h-12 w-full rounded-xl border border-border bg-white/[0.03] px-4 text-center text-lg font-semibold tracking-[0.5em] text-foreground placeholder:text-muted/40"
            />
          </div>

          {error && (
            <motion.p
              initial={{
                opacity: 0,
                y: -4
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
            >
              <AlertCircle size={14} className="shrink-0" />

              {error}
            </motion.p>
          )}

          {verified && (
            <motion.p
              initial={{
                opacity: 0,
                y: -4
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-[13px] text-success"
            >
              <CheckCircle2 size={14} className="shrink-0" />
              Email verified. Redirecting to login...
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || verified || otp.length !== 6}
            className="focus-ring flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-deep text-[14.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.55)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : verified ? (
              "Verified"
            ) : (
              "Verify Email"
            )}
          </button>

          {!verified && (
            <div className="text-center">
              <p className="text-[13px] text-muted">Didn't receive the code?</p>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="focus-ring mt-1 rounded-md text-[13px] font-medium text-accent transition-colors hover:text-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend verification code"}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </main>
  );
}
