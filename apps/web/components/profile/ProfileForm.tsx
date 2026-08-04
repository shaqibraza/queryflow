"use client";

import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/src/stores/auth.store";

export function ProfileForm() {
  const user = useAuthStore((state) => state.user);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  const [loading] = useState(false);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log({
      firstName,
      lastName
    });
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-[#0d0d12]/70 p-8 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <h1 className="text-2xl font-semibold text-foreground">Profile</h1>

      <p className="mt-2 text-sm text-muted">Manage your personal information.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-7">
        {/* Avatar */}

        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-deep">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.firstName} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
                {initials}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition hover:bg-white/[0.04] disabled:cursor-not-allowed"
          >
            <Camera size={16} />
            Change Photo
          </button>
        </div>

        {/* First Name */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First Name</label>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
          />
        </div>

        {/* Last Name */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Name</label>

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
          />
        </div>

        {/* Email */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email Address</label>

          <input
            disabled
            value={user?.email ?? ""}
            className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-background/50 px-4 text-sm text-muted"
          />
        </div>

        {/* Save */}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-deep font-medium text-white transition hover:opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
