"use client";

import { motion } from "framer-motion";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.42 3.58v3h3.91c2.29-2.11 3.53-5.22 3.53-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.91-3c-1.09.73-2.48 1.16-4.02 1.16-3.09 0-5.71-2.09-6.65-4.9H1.32v3.09C3.29 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.35 14.35c-.24-.73-.38-1.5-.38-2.35s.14-1.62.38-2.35V6.56H1.32C.48 8.24 0 10.06 0 12s.48 3.76 1.32 5.44l4.03-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.29 2.7 1.32 6.56l4.03 3.09c.94-2.81 3.56-4.9 6.65-4.9z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.4 0 12.06c0 5.32 3.44 9.83 8.21 11.42.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.62-4.04-1.62-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.07 1.85 2.81 1.31 3.5 1 .11-.79.42-1.31.76-1.62-2.67-.31-5.47-1.35-5.47-6.02 0-1.33.47-2.41 1.24-3.26-.12-.31-.54-1.56.12-3.25 0 0 1.01-.33 3.3 1.25a11.3 11.3 0 0 1 6 0c2.29-1.58 3.3-1.25 3.3-1.25.66 1.69.24 2.94.12 3.25.77.85 1.24 1.93 1.24 3.26 0 4.68-2.81 5.71-5.49 6.01.43.38.81 1.13.81 2.28 0 1.64-.01 2.97-.01 3.37 0 .32.22.7.83.58C20.56 21.88 24 17.37 24 12.06 24 5.4 18.63 0 12 0z"
      />
    </svg>
  );
}

interface OAuthButtonsProps {
  onGoogleClick?: () => void;
  onGitHubClick?: () => void;
}

export function OAuthButtons({ onGoogleClick, onGitHubClick }: OAuthButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <motion.button
        type="button"
        onClick={onGoogleClick}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        suppressHydrationWarning
        className="focus-ring flex h-[48px] items-center justify-center gap-2.5 rounded-xl border border-border bg-white/[0.02] text-[13.5px] font-medium text-foreground/90 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]"
      >
        <GoogleIcon />
        Continue with Google
      </motion.button>
      <motion.button
        type="button"
        onClick={onGitHubClick}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        suppressHydrationWarning
        className="focus-ring flex h-[48px] items-center justify-center gap-2.5 rounded-xl border border-border bg-white/[0.02] text-[13.5px] font-medium text-foreground/90 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]"
      >
        <GitHubIcon />
        Continue with GitHub
      </motion.button>
    </div>
  );
}
