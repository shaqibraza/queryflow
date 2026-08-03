"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  endAdornment?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, success, endAdornment, id, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-1.5 block text-[12.5px] font-medium text-muted">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            suppressHydrationWarning
            className={cn(
              "focus-ring h-[52px] w-full rounded-xl border bg-white/[0.03] px-4 text-[14px] text-foreground placeholder:text-muted/70",
              "transition-[border-color,box-shadow] duration-200",
              error ? "border-danger/60" : success ? "border-success/60" : "border-border",
              endAdornment && "pr-11",
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</div>
          )}
          {!endAdornment && success && (
            <CheckCircle2
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-success"
            />
          )}
          {focused && !error && (
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-accent/10 blur-md" />
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${inputId}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 flex items-center gap-1 text-[12px] text-danger"
            >
              <AlertCircle size={12} />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
