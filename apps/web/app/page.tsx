"use client";

import { useEffect } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Background } from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SupportedDatabases } from "@/components/landing/supported-databases";
import { CTA } from "@/components/landing/cta";

import { AuthService } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/stores/auth.store";
import { AmbientBackground } from "@/components/auth/AmbientBackground";

export default function HomePage() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const user = useAuthStore((state) => state.user);

  const accessToken = useAuthStore((state) => state.accessToken);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      if (!user) {
        return;
      }

      if (accessToken) {
        try {
          const currentUser = await AuthService.me();

          if (cancelled) {
            return;
          }

          setUser(currentUser);

          return;
        } catch (error: any) {
          throw new Error(error);
        }
      }

      try {
        const response = await AuthService.refresh();

        if (cancelled) {
          return;
        }

        const newAccessToken = response?.accessToken ?? response?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh response did not contain an access token");
        }

        setAccessToken(newAccessToken);

        const currentUser = await AuthService.me();

        if (cancelled) {
          return;
        }

        setUser(currentUser);
      } catch (error) {
        if (cancelled) {
          return;
        }

        logout();
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, accessToken, setAccessToken, setUser, logout]);

  return (
    <main className="relative min-h-screen bg-[#09090B]">
      <AmbientBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <SupportedDatabases />
      <CTA />
      <Footer />
    </main>
  );
}
