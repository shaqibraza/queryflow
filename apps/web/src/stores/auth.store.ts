import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false
        }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: true
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value
        })
    }),
    {
      name: "queryflow-auth",

      partialize: (state) => ({
        user: state.user
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          state?.setHasHydrated(true);
        };
      }
    }
  )
);
