/**
 * Onboarding Store
 * Tracks whether the user has completed the initial onboarding flow.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingStore = {
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
};

export const useOnboardingStore = create(
  persist<OnboardingStore>(
    (set) => ({
      onboarded: false,
      setOnboarded: (value: boolean) => set({ onboarded: value }),
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);