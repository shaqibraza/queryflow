"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UserProfileCardProps {
  name: string;
  email: string;
  avatar?: string | null;
  onLogout?: () => void;
}

export function UserProfileCard({ name, email, avatar, onLogout }: UserProfileCardProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-[calc(100%+10px)] left-0 right-0 z-50 overflow-hidden rounded-xl border border-border bg-[#0d0d12]/95 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-foreground transition-colors duration-150 hover:bg-white/[0.05]"
            >
              <User size={15} />
              Profile
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-danger transition-colors duration-150 hover:bg-danger/10"
            >
              <LogOut size={15} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        suppressHydrationWarning
        className="focus-ring flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 text-left transition-colors duration-150 hover:border-border hover:bg-white/[0.04]"
      >
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-deep text-[11px] font-semibold text-white">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">{initials}</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">{name}</p>
          <p className="truncate text-[11.5px] text-muted">{email}</p>
        </div>

        <ChevronUp
          size={14}
          className={cn(
            "shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
