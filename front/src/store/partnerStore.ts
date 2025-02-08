import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

import { User } from '@/types/user'

interface PartnerStore {
  partner : User | null;

  setPartner: (partner: User) => void;
  clearPartner: () => void;
}

export const usePartnerStore = create<PartnerStore>()(
  persist(
    (set) => ({
      partner: null,
      setPartner: (partner) => set({ partner }),
      clearPartner: () => set({ partner: null }),
    }),
    {
      name: "partner-storage",
			storage: createJSONStorage(() => sessionStorage),
    }
  )
);
