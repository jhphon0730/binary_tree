import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

import { User } from '@/types/user'

interface AuthStore {
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
			storage: createJSONStorage(() => sessionStorage),
    }
  )
);
