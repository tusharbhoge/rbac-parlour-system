import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "ADMIN" | "SUPER_ADMIN" | null;

interface AuthStore {
  token: string | null;
  role: Role;
  isLoggedIn: boolean;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isLoggedIn: false,

      login: (token, role) => {
        set({ token, role, isLoggedIn: true });
      },
      
      logout: () => {
        set({ token: null, role: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
