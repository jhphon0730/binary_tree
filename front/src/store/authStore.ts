import { create } from "zustand";

import { User } from '@/types/user'

interface AuthStore {
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, // default value

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));