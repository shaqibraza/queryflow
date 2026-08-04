import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;

  logout: () => void;

  setUser: (user: User) => void;

  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      accessToken: null,

      isAuthenticated: false,

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
          user
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token
        })
    }),
    {
      name: "queryflow-auth",

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
