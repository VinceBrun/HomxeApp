import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RememberMeStore = {
  rememberMe: boolean;
  email: string | null;
  setRememberMe: (value: boolean) => void;
  setEmail: (value: string | null) => void;
};

export const useRememberMeStore = create<RememberMeStore>()(
  persist(
    (set) => ({
      rememberMe: true,
      email: null,
      setRememberMe: (value: boolean) => set({ rememberMe: value }),
      setEmail: (value: string | null) => set({ email: value }),
    }),
    {
      name: "rememberMe",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);