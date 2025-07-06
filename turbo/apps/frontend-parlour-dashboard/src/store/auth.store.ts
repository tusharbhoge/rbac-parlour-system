// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type Role = "ADMIN" | "SUPER_ADMIN" | null;

// interface AuthStore {
//   token: string | null;
//   role: Role;
//   isLoggedIn: boolean;
//   hasHydrated: boolean;
//   login: (token: string, role: Role) => void;
//   logout: () => void;
//   setHasHydrated: (hydrated: boolean) => void;
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       token: null,
//       role: null,
//       isLoggedIn: false,
//       hasHydrated: false,

//       login: (token, role) => {
//         set({ token, role, isLoggedIn: true });
//       },

//       logout: () => {
//         set({ token: null, role: null, isLoggedIn: false });
//       },

//       setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
//     }),
//     {
//       name: "auth-storage",
//       skipHydration: true,
//       onRehydrateStorage: () => (state) => {
//         state?.setHasHydrated(true);
//       },
//     }
//   )
// );
