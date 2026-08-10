"use client";

import Image from "next/image";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { useAuthStore } from "@/src/stores/auth.store";
import { AuthService } from "@/src/services/auth.service";
import { getAuthErrorMessage } from "@/lib/get-auth-error-message";

export function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");

  const [lastName, setLastName] = useState(user?.lastName ?? "");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
   * Keep local form values synchronized
   * with the Zustand user.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (trimmedFirstName.length < 2 || trimmedLastName.length < 2) {
      setErrorMessage("First name and last name must be at least 2 characters.");

      return;
    }

    if (!user) {
      setErrorMessage("Unable to update profile. Please log in again.");

      return;
    }

    try {
      setLoading(true);

      const response = await AuthService.updateProfile({
        firstName: trimmedFirstName,
        lastName: trimmedLastName
      });

      /*
       * Backend returns:
       *
       * {
       *   user: {...}
       * }
       */
      const updatedUser = response.user;

      /*
       * Update Zustand so the new name is
       * immediately reflected everywhere.
       */
      setUser(updatedUser);

      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);

      const response = await AuthService.uploadAvatar(file);

      const updatedUser = response.user;

      setUser(updatedUser);

      setSuccessMessage("Avatar updated successfully.");
    } catch (error) {
      console.error("Avatar upload failed:", error);

      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);

      /*
       * Allows selecting the same file again
       * after an upload/error.
       */
      event.target.value = "";
    }
  }

  return (
    <div className="w-full max-w-md">
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

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition hover:bg-white/[0.04] disabled:cursor-not-allowed"
            >
              <Camera size={16} />
              Change Photo
            </button>
          </div>
        </div>

        {/* First Name */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First Name</label>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        {/* Last Name */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Name</label>

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-70"
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

          <div className="flex items-center gap-1.5 text-xs">
            {user?.emailVerified ? (
              <>
                <CheckCircle2 size={14} className="text-success" />

                <span className="text-success">Verified</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} className="text-yellow-400" />

                <span className="text-yellow-400">Not verified</span>
              </>
            )}
          </div>
        </div>

        {/* Feedback */}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-[13px] text-success">
            <CheckCircle2 size={14} className="shrink-0" />

            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2.5 text-[13px] text-danger">
            <AlertCircle size={14} className="shrink-0" />

            {errorMessage}
          </div>
        )}

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
